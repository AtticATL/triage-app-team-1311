// Re-export the base64 encoding utils
export {
  Encode as encodeBase64,
  Decode as decodeBase64,
} from "arraybuffer-encoding/base64/standard";

// Re-export the hex encoding utils
export {
  Encode as encodeHex,
  Decode as decodeHex,
} from "arraybuffer-encoding/hex";

/**
 * Most operations can take either the buffer allocation itself (ArrayBuffer), or
 * a typed view over that allocation (in our case, Uint8Array, although others are acceptable.)
 */
export type BufferSource = ArrayBuffer | Uint8Array;

/**
 * Encode some text as UTF-8 binary data.
 *
 * @param text The text to encode
 */
export function encodeText(text: string): ArrayBuffer {
  return new TextEncoder().encode(text).buffer;
}

/**
 * Decode a string from UTF-8 encoded binary data.
 *
 * @param buf The buffer to decode into text
 */
export function decodeText(buf: BufferSource): string {
  return new TextDecoder("utf-8").decode(buf);
}

/**
 * Encode an object as JSON-encoded binary data.
 *
 * @param json The Object to encode
 */
export function encodeJson(json: unknown): ArrayBuffer {
  let text = JSON.stringify(json);
  return encodeText(text);
}

/**
 * Decode an object from JSON-encoded binary data.
 *
 * @param buf The buffer to decode
 */
export function decodeJson(buf: BufferSource): unknown {
  let text = decodeText(buf);
  return JSON.parse(text);
}
