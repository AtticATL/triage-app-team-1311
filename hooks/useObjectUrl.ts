import { useState, useEffect } from "react";

import { Handle, get } from "../lib/storage/storage";
import { encodeBase64 } from "../lib/storage/encoding";

type SuccessResult = { url: string; loading: false; error: null };
type LoadingResult = { url: null; loading: true; error: null };
type ErrorResult = { url: null; loading: false; error: Error };
export type Result = LoadingResult | ErrorResult | SuccessResult;

export default function useObjectUrl(
  handle: Handle,
  mimeType?: string
): Result {
  let [result, setResult] = useState<Result>({
    loading: true,
    url: null,
    error: null,
  });

  // Every time the handle changes, reload the image data from blob storage.
  useEffect(() => {
    let url: string;
    let cancel = false;

    async function loadData() {
      let buf = await get(handle);
      if (buf == null) {
        throw new Error(`Could not load image with id: ${handle.id}`);
      }

      let blob = new Blob([buf], { type: mimeType });

      url = URL.createObjectURL(blob);
      return url;
    }
    loadData()
      .then((url) => {
        if (!cancel) {
          setResult({ url, loading: false, error: null });
        }
      })
      .catch((e) => {
        if (!cancel) {
          setResult({ url: null, loading: false, error: e });
        }
      });

    return () => {
      cancel = true;

      // Clean up the object URL on unmount
      if (url) {
        URL.revokeObjectURL(url);
      }
    };
  }, [handle]);

  return result;
}
