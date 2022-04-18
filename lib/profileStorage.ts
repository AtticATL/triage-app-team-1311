import { useEffect, useState } from "react";
import { Profile } from "./profile";

const PROFILES_KEY = "@triage-app/profiles";

const profileEvents = new EventTarget();

/** Stores a profile on the device */
export async function storeProfile(profile: Profile) {
  let profiles = await listProfiles();
  profiles.push(profile);
  window.localStorage.setItem(PROFILES_KEY, JSON.stringify(profiles));
  profileEvents.dispatchEvent(new Event("changed"));
}

/** Lists the profiles stored on the device */
export async function listProfiles(): Promise<Profile[]> {
  const profilesJson = window.localStorage.getItem(PROFILES_KEY);
  return JSON.parse(profilesJson || "[]");
}

/** Stores a profile on the device */
export async function deleteProfile(profile: Profile) {
  let profiles = await listProfiles();
  profiles = profiles.filter(
    (p) =>
      !(
        p.identity.name == profile.identity.name &&
        p.identity.birthYear == profile.identity.birthYear &&
        p.identity.sex == profile.identity.sex
      )
  );
  window.localStorage.setItem(PROFILES_KEY, JSON.stringify(profiles));
  profileEvents.dispatchEvent(new Event("changed"));
}

export function useProfiles(): Profile[] | null {
  let [profiles, setProfiles] = useState<Profile[] | null>(null);
  useEffect(() => {
    const update = () => listProfiles().then((p) => setProfiles(p));

    update(); // once, initially

    let listener = () => {
      update();
    };

    profileEvents.addEventListener("changed", listener);
    return () => profileEvents.removeEventListener("changed", listener);
  }, []);

  return profiles;
}
