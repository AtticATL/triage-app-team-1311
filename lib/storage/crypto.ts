import crypto from "isomorphic-webcrypto";

/** AES-GCM IVs are 12 bytes long **/
const IV_LENGTH_BYTES = 12;

/** 256-bit keys are 8 bytes long */
const KEY_LENGTH_BYTES = 256 / 8;

/**
 * Web Crypto operations can take either the buffer allocation itself (ArrayBuffer), or
 * a typed view over that allocation (in our case, Uint8Array, although others are acceptable.)
 */
type BufferSource = ArrayBuffer | Uint8Array;

/**
 * Generate a symmetric encryption key.
 */
export async function generateKey(): Promise<CryptoKey> {
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
  // IVs for AES-GCM need to be 96 bits (12 bytes) long.
  // Generate random bytes with the secure random number generator.
  const buf = new ArrayBuffer(IV_LENGTH_BYTES);
  crypto.getRandomValues(new Uint8Array(buf));
  return buf;
}

/**
 * Encode some text as UTF-8 binary data.
 */
export function encodeText(text: string): ArrayBuffer {
  return new TextEncoder().encode(text).buffer;
}

/**
 * Decode a string from UTF-8 encoded binary data.
 */
export function decodeText(buf: BufferSource): string {
  return new TextDecoder("utf-8").decode(buf);
}

/**
 * Encrypt some ciphertext using AES-GCM with the given key.
 *
 * This will prepend some metadata---like the AES IV---to the ciphertext.
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
