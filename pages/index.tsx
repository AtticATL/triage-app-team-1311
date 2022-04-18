import * as React from "react";
import { useEffect, useState } from "react";
import {
  Pane,
  Text,
  Heading,
  Spinner,
  Button,
  Card,
  IconButton,
  Popover,
  Menu,
  TrashIcon,
  Position,
} from "evergreen-ui";
import {
  FiCornerUpRight,
  FiCornerLeftDown,
  FiMoreVertical,
  FiTrash2,
} from "react-icons/fi";
import Head from "next/head";
import Link from "next/link";
import Container from "../components/Container";
import TileLink from "../components/TileLink";
import * as Profile from "../lib/profile";
import {
  useLocalProfiles,
  deleteLocalProfile,
  StoredProfileRef,
} from "../lib/storage/localProfileStorage";
import { useStoredObject } from "../lib/storage/storage";
import { muted } from "../colors";

export default function Home() {
  return (
    <div>
      <Head>
        <title>TransferApp</title>
        <meta
          name="description"
          content="Fast and accurate patient transfers"
        />
      </Head>
      <main>
        <Container>
          <Pane marginY={40}>
            <Heading size={900}>TransferApp</Heading>
          </Pane>

          <Pane marginY={40} display="flex" flexWrap="wrap" gap={16}>
            <TileLink href="/create" icon={<FiCornerUpRight />}>
              Create a Profile
            </TileLink>
            <TileLink href="/receive" icon={<FiCornerLeftDown />} secondary>
              Receive a Profile
            </TileLink>
          </Pane>
          <Pane marginY={40}>
            <ProfileList />
          </Pane>
          {process.env.NODE_ENV == "development" && (
            <Pane marginTop={64}>
              <Link href="/debug">
                <a>Debug</a>
              </Link>
            </Pane>
          )}
        </Container>
      </main>
    </div>
  );
}

function ProfileList() {
  const profiles = useLocalProfiles();

  if (profiles == null) {
    return <Spinner />;
  }

  if (profiles.length == 0) {
    return (
      <>
        <Heading>Recent Profiles</Heading>
        <Text color={muted}>
          Profiles you send or receive will appear here.
        </Text>
      </>
    );
  }

  return (
    <>
      <Heading marginBottom={8}>Recent Profiles</Heading>
      <Pane display="flex" flexDirection="column" gap={8}>
        {profiles.map((p) => (
          <ProfileCard profile={p} key={p.id} />
        ))}
      </Pane>
    </>
  );
}

function ProfileCard({ profile: stored }: { profile: StoredProfileRef }) {
  const {
    value: profile,
    loading,
    error,
  } = useStoredObject(stored.handle, Profile.Profile);

  if (loading) {
    return <Card elevation={1} height={32} />;
  }

  if (error) {
    return <Card elevation={1}>Error: {error.toString()}</Card>;
  }

  return (
    <Card elevation={1} padding={16}>
      <Pane display="flex" flexDirection="row" alignItems="center">
        <Link
          href={`/profile/${stored.handle.id}#${stored.handle.key}`}
          passHref
        >
          <Pane is="a" flex="1">
            <Pane>
              <Text color="black" fontSize="1.1em">
                {profile.identity.name}
              </Text>
            </Pane>
            <Pane>
              <Text>{profile.identity.sex}</Text>
              <Text marginX={8}>{"·"}</Text>
              <Text>
                {new Date().getFullYear() - profile.identity.birthYear}
              </Text>
            </Pane>
          </Pane>
        </Link>
        <Pane>
          <Popover
            position={Position.BOTTOM_LEFT}
            content={
              <Menu>
                <Menu.Item
                  onSelect={() => deleteLocalProfile(stored.id)}
                  icon={TrashIcon}
                  intent="danger"
                >
                  Delete
                </Menu.Item>
              </Menu>
            }
          >
            <IconButton appearance="minimal" icon={FiMoreVertical} />
          </Popover>
        </Pane>
      </Pane>
    </Card>
  );
}
