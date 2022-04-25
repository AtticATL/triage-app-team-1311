import { Text, Button, Heading, Pane, Paragraph, toaster } from "evergreen-ui";
import ScreenFrame from "../components/ScreenFrame";
import { z } from "zod";
import { TextField, useField } from "../components/Form";
import { Pin, PIN_DIGITS, PinProtectedHandle } from "../lib/pin";
import { useMemo, useState } from "react";
import { FiArrowRight } from "react-icons/fi";
import { db } from "../lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import { exportKey } from "../lib/storage/crypto";
import { encodeHex } from "../lib/storage/encoding";
import { useRouter } from "next/router";
import { putLocalProfile } from "../lib/storage/localProfileStorage";

const PinText = z
  .string()
  .length(PIN_DIGITS)
  .regex(/^[0-9]*$/, { message: "PIN must be numeric" })
  .refine(
    (p) => Pin.parse(p).is == "ok",
    (p) => {
      const parsed = Pin.parse(p);
      if (parsed.is == "err") {
        return { message: parsed.issue };
      } else {
        return { message: "Invalid PIN" };
      }
    }
  );

export default function Receive() {
  const pinField = useField(PinText);

  const router = useRouter();

  const [working, setWorking] = useState(false);
  const [status, setStatus] = useState<null | string>(null);

  const pin: string | null = useMemo(() => {
    let parsed = PinText.safeParse(pinField.value);
    if (parsed.success) {
      return parsed.data;
    } else {
      return null;
    }
  }, [pinField.value]);

  const onSubmit = async () => {
    setWorking(true);

    let p: Pin;
    const parsed = Pin.parse(pin as string);
    if (parsed.is == "err") {
      setStatus("Pin is invalid");
      setWorking(false);
      return;
    } else {
      p = parsed.pin;
    }

    // Compute the ident key
    setStatus("Checking PIN...");
    const indexKey = (await p.keys()).identKey;
    const ident = encodeHex(await exportKey(indexKey));

    // Get the doc from Firestore
    setStatus("Fetching profile metadata...");
    const ref = doc(db, "pins", ident);
    const stored = (await getDoc(ref)).data();

    if (typeof stored == "undefined") {
      toaster.danger("No profile found with this PIN", {
        description: "Check that you typed in the PIN correctly",
      });
      setStatus(null);
      setWorking(false);
      return;
    }

    let pph;
    const pphParsed = PinProtectedHandle.safeParse(stored);
    if (pphParsed.success) {
      pph = pphParsed.data;
    } else {
      toaster.danger("We found the profile, but the data was invalid.", {
        description: "Try transferring with a URL or QR code instead.",
      });
      setStatus(null);
      setWorking(false);
      return;
    }

    // Wrap the profile handle with the PIN
    setStatus("Decrypting profile...");
    const handle = await p.unwrapHandle(pph);

    // Add the profile to the history list
    await putLocalProfile(handle);

    router.push(`/profile/${handle.id}#${handle.key}`);
  };

  return (
    <ScreenFrame title="Receive Profile">
      <Pane marginY={40}>
        <Heading size={900}>Receive a Profile</Heading>
        <Paragraph>
          Type in a PIN to open a profile communicated over a phone call.
        </Paragraph>
      </Pane>

      <TextField
        field={pinField}
        label="Profile PIN"
        help="Enter the PIN read to you by the ED"
        inputMode="numeric"
      />

      <Button
        iconAfter={FiArrowRight}
        disabled={pin == null || working}
        intent="success"
        appearance="primary"
        height={64}
        textAlign="center"
        display="block"
        width="100%"
        marginTop={32}
        onClick={onSubmit}
      >
        Open Profile
      </Button>
      {status != null && (
        <Paragraph
          marginTop={8}
          width="100%"
          textAlign="center"
          fontStyle="italic"
        >
          {status}
        </Paragraph>
      )}
    </ScreenFrame>
  );
}
