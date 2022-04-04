import AsyncStorage from "@react-native-async-storage/async-storage";
import { Profile } from "./profile";

const PROFILES_KEY = "@triage-app/profiles";

/** Stores a profile on the device */
export async function storeProfile(profile: Profile) {
  let profiles = await listProfiles();
  profiles.push(profile);
  await AsyncStorage.setItem(PROFILES_KEY, JSON.stringify(profiles));
}

/** Lists the profiles stored on the device */
export async function listProfiles(): Promise<Profile[]> {
  const profilesJson = await AsyncStorage.getItem(PROFILES_KEY);
  return JSON.parse(profilesJson || "[]");
}

/** Stores a profile on the device */
export async function deleteProfile(profile: Profile) {
  let profiles = await listProfiles();
  profiles = profiles.filter(
    (p) =>
      p.identity.name != profile.identity.name ||
      p.identity.birthYear != profile.identity.birthYear ||
      p.identity.sex != profile.identity.sex
  );
  await AsyncStorage.setItem(PROFILES_KEY, JSON.stringify(profiles));
}
