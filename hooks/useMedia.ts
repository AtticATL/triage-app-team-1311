import { useState, useEffect } from "react";

import { Handle, get } from "../lib/storage/storage";
import { encodeBase64 } from "../lib/storage/encoding";

export function useMedia(handle: Handle): string | null {
  let [dataUri, setDataUri] = useState<string | null>(null);

  // Every time the handle changes, reload the image data from blob storage.
  useEffect(() => {
    async function loadData() {
      let data = await get(handle);
      if (data == null) {
        throw new Error(`Could not load image with hash: ${handle.hash}`);
      }

      let b64 = encodeBase64(data);

      setDataUri(`data:image/jpeg;base64,${b64}`);
    }
    loadData();
  }, [handle]);

  return dataUri;
}
