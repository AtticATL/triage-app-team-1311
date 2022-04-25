import {
  generateDecimalPin,
  deriveKeysFromPin,
  uint64ToBytes,
  hash,
  bytesToUint64,
  DerivedKeys,
  wrapKey,
  exportKey,
  importKey,
  unwrapKey,
} from "./storage/crypto";
import { Base64, Uuid4 } from "./storage/storage";
import { damm } from "cdigit";
import { z } from "zod";
import { Handle, Base64String } from "./profile";
import { decodeBase64, encodeBase64 } from "./storage/encoding";

export const PIN_KEY_DIGITS = 11;
export const PIN_CHECKSUM_DIGITS = 1;
export const PIN_DIGITS = PIN_KEY_DIGITS + PIN_CHECKSUM_DIGITS;

export const PinProtectedHandle = z.object({
  id: z.string().uuid(),
  wrappedKey: Base64String,
});
export type PinProtectedHandle = z.infer<typeof PinProtectedHandle>;

export class Pin {
  readonly pin: bigint;

  private constructor(pin: bigint) {
    this.pin = pin;
  }

  /** Generate a PIN and salt combination */
  static async generate(): Promise<Pin> {
    const pin = await generateDecimalPin(PIN_KEY_DIGITS);
    return new Pin(pin);
  }

  /** Create a PIN from a known sequence of digits */
  static fromRawDigits(pin: bigint): Pin {
    return new Pin(pin);
  }

  /** Check a PIN string for validity. If it's valid, return the pin's hash. */
  static parse(
    raw: string
  ): { is: "err"; issue: string } | { is: "ok"; pin: Pin } {
    // Strip any space characters from the PIN string.
    const pinString = raw.replaceAll(/\s/g, "");

    // Make sure the PIN is the right length
    if (pinString.length != PIN_DIGITS) {
      return { is: "err", issue: `PIN is not ${PIN_DIGITS} digits long` };
    }

    // Make sure the checksum is valid
    if (!damm.validate(pinString)) {
      return {
        is: "err",
        issue: `Invalid PIN: check for swapped or incorrect digits`,
      };
    }

    // Split the PIN part from the checksum, parse it.
    const pinPart = pinString.substring(0, PIN_KEY_DIGITS);
    const pin = BigInt(pinPart);
    return { is: "ok", pin: new Pin(pin) };
  }

  /** Display the PIN and its checksum as a string */
  public toString(): string {
    return `${this.pin}${this.checksum()}`;
  }

  /** Compute a checksum for the generated PIN */
  checksum(): bigint {
    // Use the Damm algorithm to generate a check digit. This will
    // catch all single-digit errors and adjacent-transposition errors.
    // https://en.wikipedia.org/wiki/Damm_algorithm
    return BigInt(damm.compute(`${this.pin}`));
  }

  /** Run a KDF to derive an encryption key from the PIN code */
  private _cachedKeys?: DerivedKeys;
  public async keys(): Promise<DerivedKeys> {
    // If we've already computed the KDF, don't repeat work.
    if (this._cachedKeys) {
      return this._cachedKeys;
    }

    // Otherwise, feed the PIN to a KDF to generate two keys: an ident key, which can be
    // public, and a wrapping key, which must remain private.
    const keys = await deriveKeysFromPin(this.pin);
    this._cachedKeys = keys;
    return keys;
  }

  /** Use the PIN to encrypt a Handle */
  public async wrapHandle(handle: Handle): Promise<PinProtectedHandle> {
    const id = handle.id;
    let innerKey = await importKey(decodeBase64(handle.key));

    // Derive a wrapping key from the PIN
    let wrappingKey = (await this.keys()).wrappingKey;

    // Wrap the handle key
    let wrapped = await wrapKey({ inner: innerKey, wrapWith: wrappingKey });

    return {
      id,
      wrappedKey: encodeBase64(wrapped),
    };
  }

  /** Use the PIN to decrypt a Handle */
  public async unwrapHandle(pinProtected: PinProtectedHandle): Promise<Handle> {
    const id = pinProtected.id;
    const wrapped = decodeBase64(pinProtected.wrappedKey);

    // Get the wrapping key from the PIN
    let wrappingKey = (await this.keys()).wrappingKey;

    // Unwrap the key with it
    let unwrapped = await unwrapKey({ wrapped, unwrapWith: wrappingKey });

    return { id, key: encodeBase64(await exportKey(unwrapped)) };
  }
}
