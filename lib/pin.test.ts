import { Pin } from "./pin";
import { putJson, getJson } from "./storage/storage";

it("computes checksums correctly", () => {
  const examplePin = Pin.fromRawDigits(BigInt("12341234123"));

  const reparsed = Pin.parse(`${examplePin}`);
  if (reparsed.is == "err") {
    throw new Error(reparsed.issue);
  }
});

it("wraps handles properly", async () => {
  let earlyHandle = await putJson({ message: "It works!" });
  await earlyHandle.waitForDurableStorage;
  let handle = earlyHandle.handle;

  const pin = Pin.fromRawDigits(BigInt("12341234123"));

  // Wrap the handle
  const wrapped = await pin.wrapHandle(handle);

  // Unwrap the handle
  const unwrapped = await pin.unwrapHandle(wrapped);

  // Check we get our data out again
  let contents = await getJson(unwrapped);
  expect(contents?.message).toEqual("It works!");
});
