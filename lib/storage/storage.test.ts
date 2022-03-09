import { getJson, putJson } from "./storage";

it("should roundtrip data correctly", async () => {
  const message = "this should work oop";

  // Put the message in the storage system
  const earlyHandle = await putJson(message);

  // wait for commit
  await earlyHandle.waitForDurableStorage;

  // Get the message back
  const returned = await getJson(earlyHandle.handle);

  expect(returned).toBe(message);
});
