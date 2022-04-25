// Mock the WebCrypto API with node's implementation
// @ts-ignore
window.crypto = require("crypto").webcrypto; // polyfill

import {
  importKey,
  exportKey,
  generateKey,
  encrypt,
  decrypt,
  generateDecimalPin,
  uint64ToBytes,
  bytesToUint64,
} from "./crypto";
import { encodeText, decodeText, encodeBase64, decodeBase64 } from "./encoding";

it("generates a key", async () => {
  const key = await generateKey();
});

it("encrypts and decrypts a message correctly", async () => {
  const message = "this is a test of the encryption system";

  // Generate key and initialization vector
  const key = await generateKey();

  // Encrypt the message
  const ciphertext = await encrypt(encodeText(message), key);

  // Export and re-import the key
  let exportedKey = await exportKey(key);
  // Roundtrip through base64
  exportedKey = decodeBase64(encodeBase64(exportedKey));
  const importedKey = await importKey(exportedKey);

  // Decrypt the message
  const plaintext = await decrypt(ciphertext, importedKey);

  // Check that this worked
  expect(decodeText(plaintext)).toEqual(message);
});

it("generates decimal PINs", async () => {
  for (let attempt = 0; attempt < 100; attempt++) {
    for (let len of [4, 5, 8, 10, 15]) {
      const pin = await generateDecimalPin(len);
      expect(("" + pin).length).toBeLessThanOrEqual(len);
    }
  }
});

it("roundtrips from number to ArrayBuffer", () => {
  const tests = [1, 2, 5, 123456, 123456789, 151515151515155];
  for (let n of tests) {
    const bytes = uint64ToBytes(BigInt(n));
    const reparsed = bytesToUint64(bytes);
    expect(reparsed).toEqual(BigInt(n));
  }
});
