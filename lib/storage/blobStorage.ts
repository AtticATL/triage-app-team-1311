import { encodeBase64, decodeBase64 } from "./encoding";
import { DBSchema, openDB, IDBPDatabase } from "idb";

interface BlobDB extends DBSchema {
  blobs: {
    value: ArrayBuffer;
    key: string;
  };
}

/** Open the IndexedDB store we're using for the blobs */
async function db(): Promise<IDBPDatabase<BlobDB>> {
  if (_db == null) {
    _db = await openDB<BlobDB>("@triage-app/blobs", 2, {
      upgrade(db) {
        db.createObjectStore("blobs");
      },
    });
  }

  return _db;
}
let _db: IDBPDatabase<BlobDB> | null = null;

/** Stores a data blob in local storage. */
export async function put(id: string, data: ArrayBuffer): Promise<void> {
  console.log(`BlobStorage.put(id=${id})`);

  // TODO(cloud): Upload to cloud storage

  // Store the data to IndexedDB
  await (await db()).put("blobs", data, id);
}

/** Get a blob by its unique ID from local storage. Returns null if the key doesn't exist. */
export async function get(id: string): Promise<ArrayBuffer | null> {
  console.log(`BlobStorage.get(id=${id})`);
  let value = await (await db()).get("blobs", id);

  // TODO(cloud): Download from cloud storage

  // If the value for this key doesn't exist, return null.
  if (value == null) {
    console.log(`BlobStorage.get(id=${id}) [does not exist]`);
    return null;
  }

  // We have the value. Decode the base64 string and return it.
  return value;
}
