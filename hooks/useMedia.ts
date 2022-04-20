import { useState, useEffect } from "react";

import { Handle, get } from "../lib/storage/storage";
import { encodeBase64 } from "../lib/storage/encoding";

export function useMedia(handle: Handle): string | null {
  let [stateUrl, setUrl] = useState<string | null>(null);

  // Every time the handle changes, reload the image data from blob storage.
  useEffect(() => {
    let url: string;

    async function loadData() {
      let buf = await get(handle);
      if (buf == null) {
        throw new Error(`Could not load image with id: ${handle.id}`);
      }

      let blob = new Blob([buf]);

      url = URL.createObjectURL(blob);
      setUrl(url);
    }
    loadData();

    return () => {
      // Clean up the object URL on unmount
      if (url) {
        URL.revokeObjectURL(url);
      }
    };
  }, [handle]);

  return stateUrl;
}
