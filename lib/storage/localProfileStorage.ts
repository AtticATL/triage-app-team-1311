import { useEffect, useState } from "react";
import { Handle, Profile } from "../profile";
import { db, Schema } from "./local";
import { getJson, Uuid4 } from "./storage";

const STORE: keyof Schema & "local_profiles" = "local_profiles";

const NOTIF_BROADCAST_CHAN_NAME = "@transfer-app/local-profile-notifications";
const sendNotification = process.browser
  ? new BroadcastChannel(NOTIF_BROADCAST_CHAN_NAME)
  : null;
const recvNotification = process.browser
  ? new BroadcastChannel(NOTIF_BROADCAST_CHAN_NAME)
  : null;
const UPDATED_NOTIF = "updated" as const;

export interface StoredProfile {
  addedAt: number; // unix epoch
  handle: Handle;
}

export class StoredProfileRef {
  sp: StoredProfile;

  constructor(sp: StoredProfile) {
    this.sp = sp;
  }

  get id(): Uuid4 {
    return this.sp.handle.id;
  }

  get handle(): Handle {
    return this.sp.handle;
  }

  async get(): Promise<Profile> {
    const json = await getJson(this.sp.handle);
    return Profile.parse(json);
  }
}

export async function listLocalProfiles(): Promise<StoredProfileRef[]> {
  const all = await (await db()).getAll(STORE);
  all.sort((a, b) => b.addedAt - a.addedAt);
  return all.map((e) => new StoredProfileRef(e));
}

export async function putLocalProfile(handle: Handle): Promise<void> {
  const tx = (await db()).transaction(STORE, "readwrite");
  const objs = tx.objectStore(STORE);

  await objs.put({ handle, addedAt: Date.now() }, handle.id);
  sendNotification?.postMessage(UPDATED_NOTIF);
}

export async function deleteLocalProfile(id: Uuid4): Promise<void> {
  await (await db()).delete(STORE, id);
  sendNotification?.postMessage(UPDATED_NOTIF);
}

export function useLocalProfiles(): StoredProfileRef[] | null {
  const [profiles, setProfiles] = useState<null | StoredProfileRef[]>(null);
  useEffect(() => {
    const update = () => listLocalProfiles().then(setProfiles);
    update();

    const listener = () => {
      update();
    };

    recvNotification?.addEventListener("message", listener);
    return () => recvNotification?.removeEventListener("message", listener);
  }, []);

  return profiles;
}
