import { useRouter } from "next/router";
import { useHash } from "react-use";
import Error from "next/error";
import { z } from "zod";
import { Handle } from "../../lib/profile";
import { db } from "../../lib/firebase";
import { Profile, Base64String } from "../../lib/profile";
import dynamic from "next/dynamic";
import ScreenFrame from "../../components/ScreenFrame";
import { useStoredObject } from "../../lib/storage/storage";
import { useEffect, useState } from "react";
import {
  Text,
  Heading,
  Pane,
  Spinner,
  Card,
  Paragraph,
  Button,
  SideSheet,
  Position,
  TextInput,
  toaster,
  UnorderedList,
  ListItem,
} from "evergreen-ui";
import BlobMedia from "../../components/BlobMedia";
import Checkbox from "../../components/Checkbox";
import { CHECKLIST, QUESTIONS } from "../../lib/triageQuestions";
import { Entry } from "../../components/Form";
import {
  ALLREGIONS,
  MANDIBULAR,
  MAXILLARY,
  REGIONAREAS,
} from "../../lib/injuryRegions";
import { FiCopy, FiSend, FiShare } from "react-icons/fi";
import Container from "../../components/Container";
import QRCode from "react-qr-code";
import { Pin } from "../../lib/pin";
import { encodeBase64, encodeHex } from "../../lib/storage/encoding";
import { exportKey } from "../../lib/storage/crypto";
import { collection, doc, setDoc } from "firebase/firestore";

const Params = z.object({
  query: z.object({
    profileId: Handle.shape.id,
  }),
  hash: Handle.shape.key,
});

function ViewProfileRoute() {
  const router = useRouter();
  const [hash, _] = useHash();

  // Get profile ID from URL
  const params = Params.safeParse({
    query: router.query,
    hash: hash.substring(1),
  });
  if (!params.success) {
    return <Error statusCode={404} title="Invalid profile URL" />;
  } else {
    return (
      <ViewProfilePage
        handle={{ id: params.data.query.profileId, key: params.data.hash }}
      />
    );
  }
}

function TextList({
  items,
  emptyText = "None",
}: {
  items: string[];
  emptyText: string;
}) {
  if (items.length == 0) {
    return <Text color="muted">{emptyText}</Text>;
  }

  return (
    <UnorderedList marginY={0}>
      {items.map((item, idx) => (
        <ListItem key={idx}>{item}</ListItem>
      ))}
    </UnorderedList>
  );
}

function ViewProfilePage({ handle }: { handle: Handle }) {
  const { value: profile, loading, error } = useStoredObject(handle, Profile);
  const [showSendSheet, setShowSendSheet] = useState(false);

  if (loading) {
    return (
      <ScreenFrame title="Profile">
        <Pane padding={32} marginX="auto">
          <Spinner />
        </Pane>
      </ScreenFrame>
    );
  }

  if (error) {
    return (
      <ScreenFrame title="Profile">
        <Heading marginY={32}>Error</Heading>
        <Text>{error.toString()}</Text>
      </ScreenFrame>
    );
  }

  const patientTriages = CHECKLIST.filter((id) => profile.triageChecklist[id]);
  const patientMaxillaryRegions = MAXILLARY.filter(
    (id) => profile.infectionRegions[id]
  );
  const patientMandibularRegions = MANDIBULAR.filter(
    (id) => profile.infectionRegions[id]
  );

  return (
    <>
      <SideSheet
        preventBodyScrolling
        isShown={showSendSheet}
        onCloseComplete={() => setShowSendSheet(false)}
        position={Position.TOP}
      >
        <SharePane handle={handle} profile={profile} />
      </SideSheet>
      <ScreenFrame title="Profile">
        <Pane marginY={32} display="flex" flexDirection="column" gap={16}>
          <Card elevation={0} backgroundColor="white" padding={16}>
            <Heading>Name</Heading>
            <Text fontSize={32} lineHeight={1.5} color="black">
              {profile.identity.name}
            </Text>
            <Pane display="flex" gap={32} alignItems="flex-end">
              <Pane>
                <Heading marginTop={16}>Sex</Heading>
                <Text>{profile.identity.sex}</Text>
              </Pane>
              <Pane>
                <Heading marginTop={16}>Date of Birth</Heading>
                <Text>{profile.identity.dob}</Text>
              </Pane>
              <Button
                marginLeft="auto"
                size="large"
                appearance="primary"
                iconBefore={FiSend}
                onClick={() => setShowSendSheet(true)}
              >
                Send Profile
              </Button>
            </Pane>
          </Card>
          <Card
            elevation={0}
            backgroundColor="white"
            padding={16}
            gap={16}
            display="flex"
            flexDirection="column"
          >
            <div>
              <Heading>History of Current Infection</Heading>
              <Paragraph>
                {profile.patientHistory.currentInfectionHistory}
              </Paragraph>
            </div>
            <div>
              <Heading>Medications</Heading>
              <TextList
                items={profile.patientHistory.medications}
                emptyText="No medications given"
              />
            </div>
            <div>
              <Heading>Comorbidities</Heading>
              <TextList
                items={profile.patientHistory.comorbidities}
                emptyText="No comorbidities given"
              />
            </div>
            <div>
              <Heading>Other Notes</Heading>
              <Paragraph>
                {profile.notes || (
                  <Text color="muted">No other notes were provided.</Text>
                )}
              </Paragraph>
            </div>
          </Card>
          <Card
            elevation={0}
            backgroundColor="white"
            padding={16}
            display="flex"
            flexDirection="column"
            gap={8}
          >
            <Pane>
              <Heading>Triage Checklist</Heading>
              {patientTriages.length ? (
                <Entry>
                  {patientTriages.map((id) => (
                    <Checkbox
                      key={id}
                      checked={profile.triageChecklist[id]}
                      label={QUESTIONS[id].text}
                      onChange={(v) => null}
                    />
                  ))}
                </Entry>
              ) : (
                <Text>No items selected.</Text>
              )}
            </Pane>
          </Card>
          <Card
            elevation={0}
            backgroundColor="white"
            padding={16}
            display="flex"
            flexDirection="column"
            gap={8}
          >
            <Pane>
              <Heading>Infection Regions</Heading>
              <Heading size={400} marginTop={20}>
                Mandibular
              </Heading>
              <TextList
                items={patientMandibularRegions.map(
                  (id) => REGIONAREAS[id].text
                )}
                emptyText="No mandibular regions given"
              />
              <Heading size={400}>Maxillary</Heading>
              <TextList
                items={patientMaxillaryRegions.map(
                  (id) => REGIONAREAS[id].text
                )}
                emptyText="No mandibular regions given"
              />
            </Pane>
          </Card>
          <Card
            elevation={0}
            backgroundColor="white"
            padding={16}
            display="flex"
            flexDirection="column"
            gap={8}
          >
            <Heading>Attachments</Heading>
            {profile.attachments.length == 0 && (
              <Text>Profile has no attachments.</Text>
            )}

            {profile.attachments.map((attachment) => (
              <BlobMedia key={attachment.blob.id} attachment={attachment} />
            ))}
          </Card>
        </Pane>
      </ScreenFrame>
    </>
  );
}

function SharePane({ profile, handle }: { profile: Profile; handle: Handle }) {
  const shareUrl = `${document.location.origin}/profile/${handle.id}#${handle.key}`;

  const [pin, setPin] = useState<string | null>(null);
  const [pinErr, setPinErr] = useState<string | null>(null);
  useEffect(() => {
    let cancel = false;
    async function publishPin() {
      try {
        // Generate a PIN
        const pin = await Pin.generate();

        // Wrap the profile handle with the PIN
        const wrappedProfile = await pin.wrapHandle(handle);
        const indexKey = (await pin.keys()).identKey;
        const ident = encodeHex(await exportKey(indexKey));

        // Publish the doc to Firestore
        const ref = doc(db, "pins", ident);
        await setDoc(ref, wrappedProfile);

        // Display the PIN
        if (!cancel) {
          setPin(pin.toString());
        }
      } catch (e) {
        throw e;
        if (!cancel) {
          setPinErr("" + e);
        }
      }
    }
    publishPin();

    return () => {
      cancel = true;
    };
  }, [handle]);

  return (
    <Container paddingY={32} display="flex" flexDirection="column" gap={32}>
      <Pane>
        <Heading size={800}>Send This Profile</Heading>
        <Text>Securely transfer this profile to a surgeon.</Text>
      </Pane>
      <Card
        elevation={1}
        padding={16}
        display="flex"
        flexDirection="column"
        gap={16}
      >
        <Heading>By PIN</Heading>
        {pin != null ? (
          <>
            <PinText pin={pin} />
            <Text>Read this PIN over the phone to transfer the profile.</Text>
          </>
        ) : (
          <Pane display="flex" justifyContent="center">
            <Spinner />
          </Pane>
        )}
      </Card>
      <Card
        elevation={1}
        padding={16}
        display="flex"
        flexDirection="column"
        gap={8}
      >
        <Heading>By URL</Heading>
        <Pane display="flex" gap={8}>
          <TextInput value={shareUrl} readOnly flex={1} />
          <Button
            iconBefore={FiCopy}
            onClick={async () => {
              await navigator.clipboard.writeText(shareUrl);
              toaster.success("Copied to Clipboard!");
            }}
          >
            Copy
          </Button>
          {navigator.share && (
            <Button
              appearance="primary"
              iconBefore={FiShare}
              onClick={() =>
                navigator.share({ url: shareUrl }).catch((e) => {
                  /* eat error */
                })
              }
            >
              Share
            </Button>
          )}
        </Pane>
      </Card>
      <Card elevation={1} padding={16}>
        <Heading>By QR Code</Heading>
        <Pane
          display="flex"
          justifyContent="center"
          width="100%"
          marginTop={16}
        >
          <QRCode size={200} value={shareUrl} />
        </Pane>
      </Card>
    </Container>
  );
}

function PinText({ pin }: { pin: string }) {
  // Chunk the pin into groups of 4 characters each
  const parts = [];
  for (let i = 0; i < pin.length; i += 4) {
    parts.push(pin.substring(i, i + 4));
  }

  return (
    <Pane display="flex" gap={8}>
      {parts.map((e, i) => (
        <Text lineHeight={1} fontSize={30} fontFamily="monospace" key={i}>
          {e}
        </Text>
      ))}
    </Pane>
  );
}

// Disable SSR for this route
export default dynamic(() => Promise.resolve(ViewProfileRoute), { ssr: false });
