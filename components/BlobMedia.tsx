import * as React from "react";
import { Pane, Spinner } from "evergreen-ui";
import { Handle } from "../lib/storage/storage";

import { useMedia } from "../hooks/useMedia";

export default function BlobMedia({ handle }: { handle: Handle }) {
  const dataUri = useMedia(handle);

  if (dataUri == null) {
    return (
      <Pane>
        <Spinner size={16} />
      </Pane>
    );
  }

  return (
    // No use lazy-loading this
    // eslint-disable-next-line @next/next/no-img-element
    <img
      style={{ width: "100%", height: 400, objectFit: "contain" }}
      src={dataUri}
      alt="Image Attachment"
    />
  );
}
