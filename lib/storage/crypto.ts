import { BufferSource } from "./encoding";

/** Parameters for symmetrical encryption */
const AES_MODE = "AES-GCM" as const;
const AES_KEY_BITS = 256 as const;
const AES_KEY_BYTES = AES_KEY_BITS / 8;
const AES_IV_BYTES = 12;
export type IvBytes = ArrayBuffer & { readonly _tag: unique symbol };

/** The number of KDF iterations to use while generating keys from PINs */
const KW_MODE = "AES-KW";
const KDF_ITER_WRAPPING_KEY = 1_000_000; // Protect against bruteforcing PINs
const KDF_ITER_IDENT_KEY = 500_000; // Protect against bruteforcing database IDs.
const KDF_CONSTANT_SALT = new Uint8Array([
  127, 221, 192, 50, 160, 183, 211, 169, 39, 34, 163, 207, 33, 208, 177, 116,
  63, 156, 94, 255, 123, 181, 152, 15, 201, 62, 240, 98, 179, 11, 220, 168,
]);

/** The things we need keys to be able to do. */
const AES_KEY_USAGES: KeyUsage[] = [
  "encrypt",
  "decrypt",
  "wrapKey",
  "unwrapKey",
];

/**
 * Throw an exception if this function runs in a production build.
 */
function assertDevMode(msg: string) {
  if (
    process.env.NODE_ENV !== "development" &&
    process.env.NODE_ENV !== "test"
  ) {
    throw new Error(`Cannot run debug functionality in release mode: ${msg}`);
  }
}

/**
 * Generate a symmetric encryption key.
 */
export async function generateKey(): Promise<CryptoKey> {
  return await crypto.subtle.generateKey(
    { name: AES_MODE, length: AES_KEY_BITS } as AesKeyGenParams,
    true, // Key is exportable: we can get it as an ArrayBuffer
    AES_KEY_USAGES
  );
}

/**
 * Export a CryptoKey to bytes for storage.
 */
export async function exportKey(key: CryptoKey): Promise<ArrayBuffer> {
  return await crypto.subtle.exportKey("raw", key);
}

/**
 * Import bytes into a CryptoKey for use.
 */
export async function importKey(data: BufferSource): Promise<CryptoKey> {
  return await crypto.subtle.importKey(
    "raw",
    data,
    AES_MODE,
    true,
    AES_KEY_USAGES
  );
}

/**
 * Derive two keys from some bytes, using a KDF.
 *
 * We derive two keys:
 * - The identifier key (identKey), which can be public
 * - The main key (wrappingKey), which can not be public
 *
 * The identKey is derived from the wrappingKey. This is so that the database operator cannot compute
 * a wrappingKey from an identKey, in order to decrypt stored data.
 */
export async function deriveKeysFromPin(pin: bigint): Promise<DerivedKeys> {
  const importKdfKey = (bytes: BufferSource) =>
    crypto.subtle.importKey("raw", bytes, "PBKDF2", false, ["deriveBits"]);

  // Create a (weak) CryptoKey from the PIN
  const baseKey = await importKdfKey(uint64ToBytes(pin));

  // Derive the wrapping key first
  const wrappingKeyBits = await crypto.subtle.deriveBits(
    {
      name: "PBKDF2",
      hash: "SHA-512",
      salt: KDF_CONSTANT_SALT,
      iterations: KDF_ITER_WRAPPING_KEY,
    },
    baseKey,
    AES_KEY_BITS
  );
  const wrappingKey = await importKey(wrappingKeyBits);

  // Then derive the ident key from the wrapping key, using fewer iterations.
  const identKeyBits = await crypto.subtle.deriveBits(
    {
      name: "PBKDF2",
      hash: "SHA-512",
      salt: KDF_CONSTANT_SALT,
      iterations: KDF_ITER_WRAPPING_KEY,
    },
    baseKey,
    AES_KEY_BITS
  );
  const identKey = await importKey(identKeyBits);

  return { identKey, wrappingKey };
}

export type DerivedKeys = {
  identKey: CryptoKey;
  wrappingKey: CryptoKey;
};

/**
 * Generate a decimal pin of the given number of digits
 */
export async function generateDecimalPin(digits: number): Promise<bigint> {
  if (digits > 19) {
    throw new Error(
      `cannot safely generate decimal pin ` +
        `which may overflow uint65 (${digits} digits > 2^64)`
    );
  }
  if (digits < 4) {
    throw new Error(
      `refusing to generate pin with <4 digits (attempted: ${digits})`
    );
  }

  // Generate a 64-bit uint of random data, read as much of it as we can as an integer
  const bytes = new Uint8Array(8);
  crypto.getRandomValues(bytes);
  const randNum = bytesToUint64(bytes);

  // Cap the length of the pin to respect the number of digits
  const maxPin = 10n ** BigInt(digits) - 1n;
  const pin = randNum % maxPin;

  return pin;
}

/** Encrypt an inner key with a wrapping key */
export async function wrapKey({
  inner,
  wrapWith,
}: {
  inner: CryptoKey;
  wrapWith: CryptoKey;
}): Promise<ArrayBuffer> {
  const innerBytes = await exportKey(inner);
  return await encrypt(innerBytes, wrapWith);
}

/** Decrypt an inner key with a wrapping key */
export async function unwrapKey({
  wrapped,
  unwrapWith,
}: {
  wrapped: ArrayBuffer;
  unwrapWith: CryptoKey;
}): Promise<CryptoKey> {
  const innerBytes = await decrypt(wrapped, unwrapWith);
  return await importKey(innerBytes);
}

/** Convert an integer JS number to a byte array */
export function uint64ToBytes(num: bigint): ArrayBuffer {
  if (num < 0n) {
    throw new Error("uint52ToBytes got a number that was negative");
  }

  // Write the int into an 8-byte array as a big-endian unsigned integer
  const bytes = new Uint8Array(8);
  const view = new DataView(bytes.buffer);
  view.setBigUint64(0, num, true /* big-endian */);

  return view.buffer;
}

/** Convert a byte array to an integer JS number */
export function bytesToUint64(buf: BufferSource): bigint {
  const bytes: ArrayBuffer = buf instanceof ArrayBuffer ? buf : buf.buffer;

  if (bytes.byteLength != 8) {
    throw new Error(
      `bytesToUint52 was expecting an 8-byte input, got ${bytes.byteLength}`
    );
  }

  const view = new DataView(bytes);
  const num = view.getBigUint64(0, true /* big-endian */);

  return num;
}

/**
 * Generate an initialization vector for AES-GCM.
 */
async function generateIv(): Promise<IvBytes> {
  const bytes = new Uint8Array(AES_IV_BYTES);
  crypto.getRandomValues(bytes);
  return bytes.buffer as IvBytes;
}

/**
 * Encrypt some ciphertext using AES-GCM with the given key.
 *
 * This will prepend some metadata---like the AES IV---to the ciphertext.
 *
 * @param plaintext The buffer of data to encrypt
 * @param key The key to encrypt with. If null (and a debug build), do not encrypt.
 */
export async function encrypt(
  plaintext: BufferSource,
  key: CryptoKey
): Promise<ArrayBuffer> {
  // Generate a unique initialization vector
  const iv = await generateIv();

  // Encrypt the plaintext
  const ciphertext = await crypto.subtle.encrypt(
    {
      name: AES_MODE,
      iv,
    },
    key,
    plaintext
  );

  // Set up binary headers for the ciphertext, to store the IV
  // In the future, other data might be useful to store here---so reserve
  // the first 4 bytes for some metadata (like a version number).
  const buf = new Uint8Array(4 + AES_IV_BYTES + ciphertext.byteLength);
  buf.set([1, 0, 0, 0], 0); // Copy in the version number
  buf.set(new Uint8Array(iv), 4); // Copy in the IV
  buf.set(new Uint8Array(ciphertext), 4 + AES_IV_BYTES); // Copy in the rest of the ciphertext

  return buf.buffer;
}

/**
 * Decrypt some ciphertext produced by `encrypt` using the given key.
 *
 * This will use the IV in the metadata prepended to the ciphertext by `encrypt`.
 */
export async function decrypt(
  encryptedData: BufferSource,
  key: CryptoKey
): Promise<ArrayBuffer> {
  // Split the buffer into parts
  const header = new Uint8Array(encryptedData, 0, 4);
  const iv = new Uint8Array(encryptedData, 4, AES_IV_BYTES);
  const ciphertext = new Uint8Array(encryptedData, 4 + AES_IV_BYTES);

  // Check the header:
  //    We should have a '1' in the version byte
  //    We should have zeroes for the other three bytes
  if (!(header[0] == 1 && header[1] == 0 && header[2] == 0 && header[3] == 0)) {
    throw new TypeError(
      "encrypted data package did not contain a valid header"
    );
  }

  // Decrypt the message
  return crypto.subtle.decrypt(
    {
      name: AES_MODE,
      iv,
    },
    key,
    ciphertext
  );
}

/** Compute the hash of the given data */
export async function hash(data: BufferSource): Promise<ArrayBuffer> {
  return crypto.subtle.digest("SHA-256", data);
}
