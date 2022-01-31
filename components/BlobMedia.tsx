import * as React from "react";
import { useState, useEffect } from "react";
import { Box, Spinner } from "native-base";

// @ts-ignore
import { Image } from "native-base";

import { getBlob } from "../lib/blobStorage";

export default function BlobMedia({ hash }: { hash: string }) {
  let [dataUri, setDataUri] = useState<string | null>(null);

  // Every time the hash changes, reload the image data from blob storage.
  useEffect(() => {
    async function loadData() {
      let b64 = await getBlob(hash);

      if (b64 == null) {
        throw new Error(`Could not load image with hash: ${hash}`);
      }

      setDataUri(`data:image/jpeg;base64,${b64}`);
    }
    loadData();
  }, [hash]);

  if (dataUri == null) {
    return (
      <Box>
        <Spinner size="lg" />
      </Box>
    );
  }

  return (
    <Image
      style={{ width: "100%", height: 200 }}
      resizeMode="contain"
      source={{ uri: dataUri }}
      alt="Image Attachment"
    />
  );
}
