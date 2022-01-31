import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Crypto from "expo-crypto";

const KEY_PREFIX = "@triage-app/blob/";

/** Stores a data blob in local storage. Returns that data's SHA256 hash (and storage key) */
export async function storeBlob(base64: string): Promise<string> {
  // Hash the data
  // TODO: this isn't quite right. We're hashing the base64 representation here,
  //       we really want to be hashing the binary data itself.
  const sha256hex = await Crypto.digestStringAsync(
    Crypto.CryptoDigestAlgorithm.SHA256,
    base64
  );

  // Store data addressed by its hash.
  const key = KEY_PREFIX + sha256hex;

  // Store the image data in AsyncStorage.
  await AsyncStorage.setItem(key, base64);

  return sha256hex; // return the key for later use
}

/** Get a blob by its hash from local storage. Returns null if the key doesn't exist. */
export async function getBlob(sha256hex: string): Promise<string | null> {
  return await AsyncStorage.getItem(KEY_PREFIX + sha256hex);
}
