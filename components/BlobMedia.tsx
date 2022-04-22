import * as React from "react";
import { Alert, Pane, Spinner, Text } from "evergreen-ui";
import { Attachment } from "../lib/profile";

import useObjectUrl from "../hooks/useObjectUrl";

export default function BlobMedia({ attachment }: { attachment: Attachment }) {
  const blob = useObjectUrl(attachment.blob, attachment.mimeType);

  if (blob.loading) {
    return (
      <Pane
        width="100%"
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight={128}
      >
        <Spinner size={32} />
      </Pane>
    );
  }

  if (blob.error) {
    return (
      <Alert title="Media content failed to load" intent="danger">
        <Text>{blob.error.toString()}</Text>
      </Alert>
    );
  }

  if (attachment.mimeType.startsWith("image/")) {
    return (
      // No use lazy-loading this
      // eslint-disable-next-line @next/next/no-img-element
      <img
        style={{ width: "100%", objectFit: "contain" }}
        src={blob.url}
        alt="Image Attachment"
      />
    );
  }

  if (attachment.mimeType.startsWith("video/")) {
    return (
      <video controls style={{ width: "100%", objectFit: "contain" }}>
        <source src={blob.url} />
      </video>
    );
  }

  return null;
}
