import {
  importKey,
  exportKey,
  generateKey,
  encodeText,
  decodeText,
  encrypt,
  decrypt,
} from "./crypto";

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
  const exportedKey = await exportKey(key);
  const importedKey = await importKey(exportedKey);

  // Decrypt the message
  const plaintext = await decrypt(ciphertext, importedKey);

  // Check that this worked
  expect(decodeText(plaintext)).toEqual(message);
});
