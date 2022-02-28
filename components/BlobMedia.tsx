import * as React from "react";
import { Box, Spinner } from "native-base";
import { Handle } from "../lib/storage/storage";

// @ts-ignore
import { Image } from "native-base";
import { useMedia } from "../hooks/useMedia";

export default function BlobMedia({ handle }: { handle: Handle }) {
  const dataUri = useMedia(handle);

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
