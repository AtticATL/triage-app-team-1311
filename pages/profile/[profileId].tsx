import { useRouter } from "next/router";
import { useHash } from "react-use";
import Error from "next/error";
import { z } from "zod";
import { Handle } from "../../lib/profile";
import { Profile, Base64String } from "../../lib/profile";
import dynamic from "next/dynamic";
import ScreenFrame from "../../components/ScreenFrame";
import { useStoredObject } from "../../lib/storage/storage";
import { useState } from "react";
import { Text, Heading, Pane, Spinner, Card, Paragraph } from "evergreen-ui";
import BlobMedia from "../../components/BlobMedia";

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

function ViewProfilePage({ handle }: { handle: Handle }) {
  const { value: profile, loading, error } = useStoredObject(handle, Profile);

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

  return (
    <ScreenFrame title="Profile">
      <Pane marginY={32} display="flex" flexDirection="column" gap={16}>
        <Card elevation={1} backgroundColor="white" padding={8}>
          <Heading>Name</Heading>
          <Text fontSize={32} lineHeight={1.5}>
            {profile.identity.name}
          </Text>
          <Heading marginTop={16}>Sex</Heading>
          <Text>{profile.identity.sex}</Text>
          <Heading marginTop={16}>Birth year</Heading>
          <Text>{profile.identity.birthYear}</Text>
        </Card>
        <Card elevation={1} backgroundColor="white" padding={8}>
          <Heading marginTop={16}>History of Current Infection</Heading>
          <Paragraph>
            {profile.patientHistory.currentInfectionHistory}
          </Paragraph>
          <Heading marginTop={16}>Past History</Heading>
          <Paragraph>{profile.patientHistory.pastHistory}</Paragraph>
          <Heading marginTop={16}>Other Notes</Heading>
          <Paragraph>{profile.patientHistory.otherNotes}</Paragraph>
        </Card>
        <Card elevation={1} backgroundColor="white" padding={8}>
          {profile.attachments.map((attachment) => (
            <BlobMedia key={attachment.blob.id} attachment={attachment} />
          ))}
        </Card>
      </Pane>
    </ScreenFrame>
  );
}

// Disable SSR for this route
export default dynamic(() => Promise.resolve(ViewProfileRoute), { ssr: false });
