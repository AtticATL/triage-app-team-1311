import { encodeBase64, decodeBase64 } from "./encoding";
import { DBSchema, openDB, IDBPDatabase } from "idb";
import { db } from "./local";
import { storage, login } from "../firebase";
import {
  getBytes,
  ref,
  StorageError,
  StorageReference,
  uploadBytes,
} from "firebase/storage";
import { z } from "zod";

/** Stores a data blob in local storage. */
export async function put(id: string, data: ArrayBuffer): Promise<void> {
  console.log(`BlobStorage.put(id=${id})`);

  // Store the data to IndexedDB
  await (await db()).put("blobs", data, id);

  if (process.env.NODE_ENV != "test") {
    // Upload the blob to Cloud Storage
    await login(); // make sure we're authenticated
    const storageRef = firebaseStorageRef(id);
    await uploadBytes(storageRef, new Uint8Array(data));
  }
}

/** Get a blob by its unique ID from local storage. Returns null if the key doesn't exist. */
export async function get(id: string): Promise<ArrayBuffer | null> {
  console.log(`BlobStorage.get(id=${id})`);

  // Try to fetch the blob from the local cache (in IndexedDB)
  let value = await (await db()).get("blobs", id);
  if (value) {
    return value;
  }

  // Try to go out to Firebase for the storage.
  if (process.env.NODE_ENV != "test") {
    try {
      await login(); // make sure we're authenticated
      const storageRef = firebaseStorageRef(id);
      return await getBytes(storageRef);
    } catch (e) {
      // Firebase doesn't have this.
      // The blob doesn't exist, return null.
      console.log(`BlobStorage.get(id=${id}) [does not exist] (${e})`);
    }
  }

  return null;
}

function firebaseStorageRef(id: string): StorageReference {
  z.string().uuid().parse(id); // Assert we're actually looking at a UUID here
  return ref(storage, `blob/${id}`);
}
