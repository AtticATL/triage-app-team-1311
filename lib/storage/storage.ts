import { encrypt, decrypt, generateKey, exportKey, importKey } from "./crypto";
import { encodeJson, decodeJson, encodeBase64, decodeBase64 } from "./encoding";
import { v4 as uuidv4 } from "uuid";
import * as BlobStorage from "./blobStorage";

/** Alias denoting a base64 string */
type Base64 = string;

/** Alias denoting a Uuidv4 */
type Uuid4 = string;

export type Handle = Readonly<{
  /** Unique uuidv4 for this item */
  id: Uuid4;

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
 * Fetch and decrypt a data blob from storage.
 *
 * @param handle The handle to the data, with the ID of its contents, and the key used to decrypt it.
 */
export async function get(handle: Handle): Promise<ArrayBuffer> {
  console.log(`Storage.get(id=${handle.id}) key=${handle.key}`);

  // Decode and import the key
  const key = await importKey(decodeBase64(handle.key));

  // Get the data, first attempting the local storage, then Cloud Storage.
  console.log(`Storage.get(id=${handle.id}) loading ciphertext...`);
  let ciphertext = await BlobStorage.get(handle.id);

  // If the ID isn't in blob storage, the data doesn't exist.
  if (ciphertext == null) {
    console.log(`Storage.get(id=${handle.id}) [does not exist]`);
    throw new Error(`Storage with id=${handle.id} does not exist`);
  }

  // Decrypt the data.
  console.log(`Storage.get(id=${handle.id}) decrypt...`);
  const plaintext = await decrypt(ciphertext, key);

  // Return the plaintext data.
  console.log(`Storage.get(id=${handle.id}) [done]`);
  return plaintext;
}

/**
 * Encrypt and store a data blob in storage.
 *
 * @param data The binary data to put in storage.
 */
export async function put(data: ArrayBuffer): Promise<EarlyHandle> {
  // Generate an ID for the data
  const id = uuidv4();

  console.log(`Storage.put() generated id=${id}`);

  // Generate a key to encrypt the data
  const key = await generateKey();
  const exportedKey = await exportKey(key);
  const keyB64 = encodeBase64(exportedKey);

  // We can perform the actual encryption and upload in a background task.
  const encryptAndUpload = async () => {
    // Perform the encryption
    //   Note: the AES-GCM IV and some metadata are prepended to the ciphertext here
    const ciphertext = await encrypt(data, key);

    // Store in blob storage.
    await BlobStorage.put(id, ciphertext);
  };

  // Return the handle immediately, without waiting for the encryption, storage, and upload to complete.
  const handle: Handle = Object.freeze({
    id,
    key: keyB64,
  });

  return { handle, waitForDurableStorage: encryptAndUpload() };
}

/**
 * Fetch, decrypt, and JSON-decode an object from storage.
 *
 * @param handle The handle to the data, with the id of its contents, and the key used to decrypt it.
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
