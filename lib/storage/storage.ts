import {
  encrypt,
  decrypt,
  generateKey,
  hash,
  exportKey,
  importKey,
} from "./crypto";
import { encodeJson, decodeJson, encodeBase64, decodeBase64 } from "./encoding";
import * as BlobStorage from "./blobStorage";

// secret storage:
//   PRIVATE datastore, explicitly shared through some other channel
//   Secure storage (encrypted with lockscreen auth) on iOS/Android
//   Session storage w/ expiration on web
//   (data hash) -> (key data)
//   () -> (device public key, device private key)  # maybe for later

// blob storage:
//   PUBLIC datastore, implicitly shared with anyone who wants it
//   basically just a cache for Firebase Storage
//   (data hash) -> (cyphertext)
//   everything in here

// put(data) -> keyID
//    generate key
//    store (keyID -> key) in key storage
//    store (keyID -> encrypt(data, key)) in blob storage
//    return keyID

// get(keyID) -> data
//    get key from key storage, cyphertext from data storage
//    decrypt cyphertext with key
//    return plaintext

/** Alias denoting a base64 string */
type Base64 = string;

export type Handle = Readonly<{
  /** The hash of the data */
  hash: Base64;

  /** The key used to store the data in the cloud storage bucket */
  key: Base64;
}>;

/**
 * A handle to some data that's still being uploaded in the background.
 *
 * If you `await handle.isInDurableStorage`, you can wait for the data to be persisted to Cloud Storage.
 */
export type EarlyHandle = {
  handle: Handle;

  /** Promise resolved when data has been stored locally and in cloud storage */
  waitForDurableStorage: Promise<void>;
};

/**
 * Cache of blobs in storage, indexed by their hash.
 */
const PLAINTEXT_BLOB_CACHE: Map<Base64, ArrayBuffer> = new Map();

/**
 * Fetch and decrypt a data blob from storage.
 *
 * @param handle The handle to the data, with the hash of its contents, and the key used to decrypt it.
 */
export async function get(handle: Handle): Promise<ArrayBuffer | null> {
  // Check to see if we have the data cached in memory.
  const cached = PLAINTEXT_BLOB_CACHE.get(handle.hash);
  if (cached != null) {
    // Defensively copy the cached value, in case the caller mutates it.
    const copy = new ArrayBuffer(cached.byteLength);
    new Uint8Array(copy).set(new Uint8Array(cached)); // bytewise copy `cached` into `copy`

    // Return from the cache
    return copy;
  }

  // Decode and import the key
  const key = await importKey(decodeBase64(handle.key));

  // Get the data, first attempting the local storage, then Cloud Storage.
  let ciphertext = await BlobStorage.get(handle.hash);

  // If the hash isn't in blob storage, the data doesn't exist.
  if (ciphertext == null) {
    return null;
  }

  // Decrypt the data.
  const plaintext = await decrypt(ciphertext, key);

  // Return the plaintext data.
  return plaintext;
}

/**
 * Encrypt and store a data blob in storage.
 *
 * @param data The binary data to put in storage.
 */
export async function put(data: ArrayBuffer): Promise<EarlyHandle> {
  // Compute the hash of the data
  const dataHash = await hash(data);
  const hashB64 = encodeBase64(dataHash);

  // Insert the data into the inmemory plaintext cache
  PLAINTEXT_BLOB_CACHE.set(hashB64, copyBuf(data));

  // Generate a key to encrypt the data
  const key = await generateKey();
  const keyB64 = encodeBase64(await exportKey(key));

  // We can perform the actual encryption and upload in a background task.
  // The plaintext is already cached in memory.
  const encryptAndUpload = async () => {
    // Perform the encryption
    //   Note: the AES-GCM IV and some metadata are prepended to the ciphertext here
    const ciphertext = await encrypt(data, key);

    // Store in blob storage.
    await BlobStorage.put(hashB64, ciphertext);
  };

  // Return the handle immediately, without waiting for the encryption, storage, and upload to complete.
  const handle: Handle = Object.freeze({
    hash: hashB64,
    key: encodeBase64(await exportKey(key)),
  });

  return { handle, waitForDurableStorage: encryptAndUpload() };
}

/**
 * Fetch, decrypt, and JSON-decode an object from storage.
 *
 * @param handle The handle to the data, with the hash of its contents, and the key used to decrypt it.
 */
export async function getJson(handle: Handle): Promise<any | null> {
  let buf = await get(handle);
  if (buf == null) return null;
  return decodeJson(buf);
}

/**
 * Encode an object as JSON, encrypt it, and put it in storage, returning a handle to that data.
 *
 * @param obj The object to encode.
 */
export async function putJson(obj: any): Promise<EarlyHandle> {
  let buf = encodeJson(obj);
  return put(buf);
}

/**
 * Make a copy of an ArrayBuffer
 */
function copyBuf(buf: ArrayBuffer): ArrayBuffer {
  const dest = new ArrayBuffer(buf.byteLength);
  new Uint8Array(dest).set(new Uint8Array(buf));
  return dest;
}
