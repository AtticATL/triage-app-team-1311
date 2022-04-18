import { BufferSource } from "./encoding";

/** AES-GCM IVs are 12 bytes long **/
const IV_LENGTH_BYTES = 12;

/** 256-bit keys are 32 bytes long */
const KEY_LENGTH_BYTES = 256 / 8;

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
  console.log("[storage/crypto] generating key");

  return await crypto.subtle.generateKey(
    {
      name: "AES-GCM",
      length: KEY_LENGTH_BYTES * 8, // 256-bit
    },
    true, // Key is exportable: we can get it as an ArrayBuffer
    ["encrypt", "decrypt"]
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
  return await crypto.subtle.importKey("raw", data, "AES-GCM", true, [
    "encrypt",
    "decrypt",
  ]);
}

/**
 * Generate an initialization vector for AES-GCM.
 */
async function generateIv(): Promise<ArrayBuffer> {
  const bytes = new Uint8Array(IV_LENGTH_BYTES);
  crypto.getRandomValues(bytes);
  return bytes.buffer;
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
  console.log("[storage/crypto] encrypt");

  // Generate a unique initialization vector
  const iv = await generateIv();

  // Encrypt the plaintext
  const ciphertext = await crypto.subtle.encrypt(
    {
      name: "AES-GCM",
      iv,
    },
    key,
    plaintext
  );

  // Set up binary headers for the ciphertext, to store the IV
  // In the future, other data might be useful to store here---so reserve
  // the first 4 bytes for some metadata (like a version number).
  const buf = new Uint8Array(4 + IV_LENGTH_BYTES + ciphertext.byteLength);
  buf.set([1, 0, 0, 0], 0); // Copy in the version number
  buf.set(new Uint8Array(iv), 4); // Copy in the IV
  buf.set(new Uint8Array(ciphertext), 4 + IV_LENGTH_BYTES); // Copy in the rest of the ciphertext

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
  console.log("[storage/crypto] decrypt");

  // Split the buffer into parts
  const header = new Uint8Array(encryptedData, 0, 4);
  const iv = new Uint8Array(encryptedData, 4, IV_LENGTH_BYTES);
  const ciphertext = new Uint8Array(encryptedData, 4 + IV_LENGTH_BYTES);

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
      name: "AES-GCM",
      iv,
    },
    key,
    ciphertext
  );
}
