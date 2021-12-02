import { StatusBar } from "expo-status-bar";
import * as React from "react";
import { useState, useRef } from "react";
import {
  KeyboardAvoidingView,
  Alert,
  Platform,
  StyleSheet,
  ScrollView,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { RootStackScreenProps } from "../types";
import { confirm } from "../lib/alert";

import { useExitConfirmation } from "../hooks/useExitConfirmation";

import { Text, View } from "../components/Themed";
import Container from "../components/Container";
import { Heading } from "../components/Typography";

import {
  Group,
  Row,
  TextInput,
  NumberInput,
  ParagraphInput,
  useField,
} from "../components/Form";

export default function ModalScreen({
  navigation,
}: RootStackScreenProps<"CreateProfile">) {
  // Confirm exit
  useExitConfirmation(true);

  const firstName = useField("");
  const lastName = useField("");
  const age = useField<number | null>(null);
  const pastMedicalHistory = useField("");
  const infectionHistory = useField("");

  return (
    <KeyboardAwareScrollView>
      <Container margin>
        <Heading h2>Demographics</Heading>

        <Group label="Name">
          <Row left="First">
            <TextInput field={firstName} nextField={lastName} />
          </Row>
          <Row left="Last">
            <TextInput field={lastName} nextField={age} />
          </Row>
        </Group>

        <Group label="Age">
          <Row>
            <NumberInput field={age} nextField={pastMedicalHistory} />
          </Row>
        </Group>

        <Group
          label="History of Infection"
          caption="The history and symptoms of this infection"
        >
          <Row>
            <ParagraphInput field={infectionHistory} />
          </Row>
        </Group>

        <Group
          label="Past Medical History"
          caption="This patient's past medical history, including prior conditions"
        >
          <Row>
            <ParagraphInput
              field={pastMedicalHistory}
              nextField={infectionHistory}
            />
          </Row>
        </Group>
      </Container>
    </KeyboardAwareScrollView>
  );
}
