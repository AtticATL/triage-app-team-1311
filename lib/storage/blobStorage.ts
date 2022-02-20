import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Crypto from "expo-crypto";
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

/** Calculate the storage key for the given hash */
const localStorageKey = (hashB64: string) =>
  `@triage-app/encrypted-blob/${hashB64}`;

/** Stores a data blob in local storage. Returns that data's SHA256 hash (and storage key) */
export async function put(hashB64: string, data: ArrayBuffer): Promise<void> {
  // Store the data to AsyncStorage.
  await AsyncStorage.setItem(localStorageKey(hashB64), encodeBase64(data));
}

/** Get a blob by its hash from local storage. Returns null if the key doesn't exist. */
export async function get(hashB64: string): Promise<ArrayBuffer | null> {
  const storageValue = await AsyncStorage.getItem(localStorageKey(hashB64));

  // If the value for this key doesn't exist, return null.
  if (storageValue == null) {
    return null;
  }

  // We have the value. Decode the base64 string and return it.
  return decodeBase64(storageValue);
}
