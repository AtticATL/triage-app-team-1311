import { Button, Text, Pane } from "evergreen-ui";
import * as React from "react";
import { useRef } from "react";
import { FiCamera, FiVideo, FiUpload } from "react-icons/fi";
import { emoryDarkBlue, emoryMediumBlue, emoryLightBlue } from "../colors";

export interface UploadProps {
  onUpload: (file: File) => unknown;
}

export function UploadCapturePhoto({ onUpload }: UploadProps) {
  let inputRef = useRef<null | HTMLInputElement>(null);

  return (
    <>
      <input
        ref={inputRef}
        hidden
        type="file"
        capture="environment"
        accept="image/jpeg,image/png"
        onChange={(e) => {
          Array.from(e.target.files || []).forEach(onUpload);
          e.target.files = null;
        }}
      />
      <Button
        onClick={() =>
          inputRef.current &&
          inputRef.current.dispatchEvent(
            new MouseEvent("click", { bubbles: true })
          )
        }
        flex="1"
        appearance="none"
        backgroundColor={emoryLightBlue}
        border="none"
        height={64}
      >
        <Pane display="flex" flexDirection="column" alignItems="center" gap={4}>
          <FiCamera color="white" />
          <Text color="white">Take Photo</Text>
        </Pane>
      </Button>
    </>
  );
}

export function UploadCaptureVideo({ onUpload }: UploadProps) {
  let inputRef = useRef<null | HTMLInputElement>(null);

  return (
    <>
      <input
        ref={inputRef}
        hidden
        type="file"
        capture="environment"
        accept="video/mp4,video/quicktime"
        onChange={(e) => {
          Array.from(e.target.files || []).forEach(onUpload);
          e.target.files = null;
        }}
      />
      <Button
        onClick={() =>
          inputRef.current &&
          inputRef.current.dispatchEvent(
            new MouseEvent("click", { bubbles: true })
          )
        }
        flex="1"
        appearance="none"
        backgroundColor={emoryMediumBlue}
        border="none"
        height={64}
      >
        <Pane display="flex" flexDirection="column" alignItems="center" gap={4}>
          <FiVideo color="white" />
          <Text color="white">Record Video</Text>
        </Pane>
      </Button>
    </>
  );
}

export function UploadFile({ onUpload }: UploadProps) {
  let inputRef = useRef<null | HTMLInputElement>(null);

  return (
    <>
      <input
        ref={inputRef}
        hidden
        type="file"
        accept="image/jpeg,image/png,video/mp4"
        onChange={(e) => {
          Array.from(e.target.files || []).forEach(onUpload);
          e.target.files = null;
        }}
      />
      <Button
        onClick={() =>
          inputRef.current &&
          inputRef.current.dispatchEvent(
            new MouseEvent("click", { bubbles: true })
          )
        }
        flex="1"
        appearance="none"
        backgroundColor={emoryDarkBlue}
        border="none"
        height={64}
      >
        <Pane display="flex" flexDirection="column" alignItems="center" gap={4}>
          <FiUpload color="white" />
          <Text color="white">Upload</Text>
        </Pane>
      </Button>
    </>
  );
}
