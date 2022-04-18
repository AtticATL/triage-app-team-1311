import { DBSchema, openDB, IDBPDatabase } from "idb";
import { Handle } from "../profile";
import { Uuid4 } from "./storage";
import type { StoredProfile } from "./localProfileStorage";

export interface Schema extends DBSchema {
  // Local encrypted blob cache
  blobs: {
    value: ArrayBuffer;
    key: Uuid4;
  };

  local_profiles: {
    value: StoredProfile;
    key: Uuid4;
  };
}

let _db: IDBPDatabase<Schema> | null = null;

/** Open the IndexedDB store we're using for the blobs */
export async function db(): Promise<IDBPDatabase<Schema>> {
  if (_db == null) {
    _db = await openDB<Schema>("@transfer-app", 1, {
      upgrade(db) {
        db.createObjectStore("blobs");
        db.createObjectStore("local_profiles");
      },
    });
    console.log("[local] db:", _db);
  }

  return _db;
}
