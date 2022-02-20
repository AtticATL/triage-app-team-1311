import * as React from "react";
import { useState, useEffect } from "react";
import { Feather } from "@expo/vector-icons";
import {
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Pressable,
  ScrollView,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { NavSubProps as RootNavSubProps } from "../App";
import * as colors from "../constants/Colors";
import TileButton from "../components/TileButton";
import { Profile } from "../lib/profile";
import { listProfiles } from "../lib/profileStorage";
import { Spinner, Text, Heading, VStack } from "native-base";

export default function HomeScreen({ navigation }: RootNavSubProps<"Home">) {
  return (
    <ScrollView>
      <VStack safeArea p={8} space={8}>
        <VStack space={4}>
          <Heading size="xl">TriageApp</Heading>

          <TileButton
            title="Create a Profile"
            icon="corner-up-right"
            onPress={() => {
              navigation.navigate("CreateProfile");
            }}
          />
          <TileButton
            light
            title="Receive a Patient"
            icon="corner-left-down"
            onPress={() => navigation.navigate("RecieveProfile")}
          />
        </VStack>

        <VStack space={4}>
          <Heading size="md">Profile Log</Heading>
          <ProfileLog />
        </VStack>
      </VStack>

      <StatusBar />
    </ScrollView>
  );
}

function ProfileLog() {
  const [profiles, setProfiles] = useState<Profile[] | null>(null);

  useEffect(() => {
    async function loadProfiles() {
      const profiles = await listProfiles();
      setProfiles(profiles);
    }

    loadProfiles();
  });

  if (profiles == null) {
    return <Spinner />;
  }

  // TODO: use `key` that isn't an index
  return (
    <VStack space={3}>
      {profiles.map((p, i) => (
        <ProfileCard key={i} profile={p} />
      ))}
    </VStack>
  );
}

function ProfileCard({ profile }: { profile: Profile }) {
  // TODO: obviously, remove clear-storage dev feature when names are tapped

  return (
    <VStack bg="white" p={4} rounded={4}>
      <Pressable onPress={() => AsyncStorage.clear()}>
        <Text fontSize="lg">{profile.identity.name}</Text>
      </Pressable>
      <Text>
        {profile.identity.sex}, Age{" "}
        {new Date().getFullYear() - profile.identity.birthYear}
      </Text>
    </VStack>
  );
}
