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
import { Text, Heading, VStack, Box, HStack } from "native-base";
import { z } from "zod";

import { NavSubProps as RootNavSubProps } from "../App";

import { useExitConfirmation } from "../hooks/useExitConfirmation";

import * as Profile from "../lib/profile";
import { confirm } from "../lib/alert";
import {
  useField,
  TextField,
  EnumField,
  NumberField,
  ParagraphField,
} from "../components/Form";

export default function CreateProfileScreen({
  navigation,
}: RootNavSubProps<"CreateProfile">) {
  // Confirm exit
  useExitConfirmation(true);

  let name = useField(Profile.Name);
  let birthYear = useField(Profile.BirthYear);
  let sex = useField(Profile.Sex);

  let currentInfectionHistory = useField(Profile.Paragraph);
  let pastHistory = useField(Profile.Paragraph);
  let otherNotes = useField(Profile.Paragraph.optional());

  let partialProfileValidator = Profile.Profile.deepPartial();
  let draftProfile: z.infer<typeof partialProfileValidator> = {
    identity: {
      name: name.value,
      birthYear: birthYear.value,
      sex: sex.value,
    },
    patientHistory: {
      currentInfectionHistory: currentInfectionHistory.value,
      pastHistory: pastHistory.value,
      otherNotes: otherNotes.value,
    },
    triageChecklist: {},
    attachments: [],
  };

  let draftValidation = Profile.Profile.safeParse(draftProfile);

  return (
    <KeyboardAwareScrollView>
      <VStack mx={4} mt={4} space={8} safeAreaBottom safeAreaX>
        <VStack space={4}>
          <Heading>Identity</Heading>
          <Text>Who is the patient?</Text>

          <TextField
            field={name}
            nextField={sex}
            label="Name"
            help="The patient's full legal name"
            placeholder="John Doe"
            size="2xl"
          />

          <EnumField
            field={sex}
            nextField={birthYear}
            label="Sex"
            help="The patient's sex, as assigned at birth"
          />

          <NumberField
            field={birthYear}
            nextField={currentInfectionHistory}
            label="Birth Year"
          />
        </VStack>

        <VStack space={4}>
          <Heading>History</Heading>
          <Text>The history of the infection</Text>

          <ParagraphField
            field={currentInfectionHistory}
            nextField={pastHistory}
            label="Infection History"
            help="The history of the current infection"
          />

          <ParagraphField
            field={pastHistory}
            nextField={otherNotes}
            label="Past History"
            help="The past medical history of the patient"
          />

          <ParagraphField
            field={otherNotes}
            label="Other Notes"
            help="Any other important information"
          />
        </VStack>

        <VStack space={4}>
          <Heading>Imaging and Attachments</Heading>
          <Text>Upload anything</Text>
        </VStack>
        <Text>{JSON.stringify(draftProfile, null, 4)}</Text>
      </VStack>
    </KeyboardAwareScrollView>
  );
}
