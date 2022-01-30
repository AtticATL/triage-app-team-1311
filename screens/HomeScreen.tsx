import * as React from "react";
import { Feather } from "@expo/vector-icons";
import {
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Pressable,
  ScrollView,
  Alert,
} from "react-native";
import { NavSubProps as RootNavSubProps } from "../App";
import * as colors from "../constants/Colors";
import TileButton from "../components/TileButton";
import Container from "../components/Container";

import { Text, View } from "../components/Themed";
import { Heading } from "../components/Typography";

export default function HomeScreen({ navigation }: RootNavSubProps<"Home">) {
  return (
    <ScrollView>
      <Container safe margin>
        <Heading h1>TriageApp</Heading>

        <View style={{ backgroundColor: "transparent", marginBottom: 20 }}>
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
            onPress={() =>
              Alert.alert(
                "Not Yet Implemented",
                "Receiving a patient profile isn't implemented yet in the prototype."
              )
            }
          />
        </View>

        <Heading h2>Profile Log</Heading>
        <Text>No profiles yet. Send a profile to see it here for review.</Text>
      </Container>

      <StatusBar />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: "80%",
  },
});
