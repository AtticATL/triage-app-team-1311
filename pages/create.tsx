import { Pane, Text, Heading, Button } from "evergreen-ui";
import NavBar from "../components/NavBar";
import Head from "next/head";
import Container from "../components/Container";
import { useCallback, useEffect, useRef, useState } from "react";
import EditProfile from "../components/EditProfile";
import * as Profile from "../lib/profile";
import ScreenFrame from "../components/ScreenFrame";
import { FiArrowRight } from "react-icons/fi";
import { putLocalProfile } from "../lib/storage/localProfileStorage";
import { NextRouter, useRouter } from "next/router";
import { encodeBase64, encodeText } from "../lib/storage/encoding";
import { putJson } from "../lib/storage/storage";

export default function Create() {
  const [profile, setProfile] = useState<Profile.Profile | null>();
  const [action, setAction] = useState<null | string>(null);

  const router = useRouter();

  const submit = async () => {
    setAction("Encrypting profile...");
    let early = await putJson(Profile.Profile.parse(profile));

    setAction("Uploading...");
    await early.waitForDurableStorage;
    const handle = early.handle;

    // If, by any chance, something's still wrong, throw.
    await putLocalProfile(handle);
    setAction("Done");

    // Return home
    router.replace(`/profile/${handle.id}#${handle.key}`);
  };

  return (
    <ScreenFrame title="Create Profile" description="Create a patient profile">
      <Pane marginY={40}>
        <Heading size={900}>Create a Profile</Heading>
      </Pane>

      <Pane marginY={40}>
        <EditProfile onChange={setProfile} />
      </Pane>

      {profile != null && (
        <Pane marginY={40}>
          <Button
            iconAfter={FiArrowRight}
            intent="success"
            appearance="primary"
            width="100%"
            height={64}
            isLoading={action != null}
            onClick={() => submit()}
          >
            Submit Profile
          </Button>
          {action && (
            <Text
              fontStyle="italic"
              textAlign="center"
              display="block"
              marginTop={8}
            >
              {action}
            </Text>
          )}
        </Pane>
      )}
    </ScreenFrame>
  );
}
