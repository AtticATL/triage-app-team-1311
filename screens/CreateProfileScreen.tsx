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
import {
  QUESTIONS,
  CHECKLIST,
  EMPTY_ANSWER_RECORD,
} from "../lib/triageQuestions";
import { confirm } from "../lib/alert";
import {
  useField,
  TextField,
  EnumField,
  NumberField,
  ParagraphField,
  Entry,
  Checkbox,
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

  // Track the true/false answers to triage questions
  let [answers, setAnswers] =
    useState<Record<string, boolean>>(EMPTY_ANSWER_RECORD);

  let partialProfileValidator = Profile.Profile.deepPartial();
  let draftProfile: z.infer<typeof partialProfileValidator> = {
    identity: {
      name: name.value,
      birthYear: birthYear.value,
      sex: sex.value,
    },
    triageChecklist: answers,
    patientHistory: {
      currentInfectionHistory: currentInfectionHistory.value,
      pastHistory: pastHistory.value,
      otherNotes: otherNotes.value,
    },
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
          <Heading>Triage Checklist</Heading>
          <Text>
            Answers to these questions can help determine the severity of this
            patient's case.
          </Text>

          <Entry space={4}>
            {CHECKLIST.map((id) => (
              <Checkbox
                key={id}
                value={answers[id]}
                label={QUESTIONS[id].text}
                onChange={(v) => setAnswers((a) => ({ ...a, [id]: v }))}
              />
            ))}
          </Entry>
        </VStack>

        <VStack space={4}>
          <Heading>Imaging and Attachments</Heading>
          <Text>Upload anything</Text>
        </VStack>
        <Text>{JSON.stringify(draftProfile, null, 4)}</Text>
        <Text>{JSON.stringify(draftValidation, null, 4)}</Text>
      </VStack>
    </KeyboardAwareScrollView>
  );
}
