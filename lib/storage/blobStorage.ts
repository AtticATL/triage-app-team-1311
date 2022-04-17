import { encodeBase64, decodeBase64 } from "./encoding";

/*
 *  Annoying note about this file:
 *
 *  For whatever reason, it's really difficult to get Expo to store binary data---all the libraries
 *  really want to deal with strings instead. For that reason, we use base64 encoding whenever we store
 *  data locally.
 *
 *  This is ugly, but it's the easiest way to get this working without dropping down into native code.
 *
 */

/** Calculate the storage key for the given ID */
const localStorageKey = (id: string) => `@triage-app/blob/id/${id}`;

/** Stores a data blob in local storage. */
export async function put(id: string, data: ArrayBuffer): Promise<void> {
  console.log(`BlobStorage.put(id=${id})`);

  // TODO(cloud): Upload to cloud storage

  // Store the data to AsyncStorage.
  window.localStorage.setItem(localStorageKey(id), encodeBase64(data));
}

/** Get a blob by its unique ID from local storage. Returns null if the key doesn't exist. */
export async function get(id: string): Promise<ArrayBuffer | null> {
  const storageKey = localStorageKey(id);

  console.log(`BlobStorage.get(id=${id}) key=${storageKey}`);
  const storageValue = window.localStorage.getItem(storageKey);

  // TODO(cloud): Download from cloud storage

  // If the value for this key doesn't exist, return null.
  if (storageValue == null) {
    console.log(`BlobStorage.get(id=${id}) [does not exist]`);
    return null;
  }

  // We have the value. Decode the base64 string and return it.
  console.log(`BlobStorage.get(id=${id}) decoding b64...`);
  const decoded = decodeBase64(storageValue);
  console.log(`BlobStorage.get(id=${id}) [done]`);
  return decoded;
}
