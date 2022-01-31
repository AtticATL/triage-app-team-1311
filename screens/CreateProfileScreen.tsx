import { StatusBar } from "expo-status-bar";
import * as React from "react";
import { useCallback, useState, useRef } from "react";
import {
  KeyboardAvoidingView,
  Alert,
  Platform,
  StyleSheet,
  ScrollView,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import {
  Text,
  Heading,
  Button,
  VStack,
  Box,
  Icon,
  HStack,
  useToken,
} from "native-base";
import { z } from "zod";
import * as ImagePicker from "expo-image-picker";
import * as Crypto from "expo-crypto";
import { Feather } from "@expo/vector-icons";

import { NavSubProps as RootNavSubProps } from "../App";

import { useExitConfirmation } from "../hooks/useExitConfirmation";

import { storeBlob, getBlob } from "../lib/blobStorage";
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
import BlobMedia from "../components/BlobMedia";

export default function CreateProfileScreen({
  navigation,
}: RootNavSubProps<"CreateProfile">) {
  // Confirm exit
  useExitConfirmation(true);

  const name = useField(Profile.Name);
  const birthYear = useField(Profile.BirthYear);
  const sex = useField(Profile.Sex);

  const currentInfectionHistory = useField(Profile.Paragraph);
  const pastHistory = useField(Profile.Paragraph);
  const otherNotes = useField(Profile.Paragraph.optional());

  // Track the true/false answers to triage questions
  let [answers, setAnswers] =
    useState<Record<string, boolean>>(EMPTY_ANSWER_RECORD);

  // Store attachments
  let [attachments, setAttachments] = useState<Array<Profile.Attachment>>([]);

  const attach = useCallback(async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      quality: 1,
      base64: true, // Give us the base64-encoded binary data here
    });

    // If they cancelled, bail out.
    if (result.cancelled) {
      return;
    }

    // Store the image.
    if (!result.base64) {
      throw new TypeError("base64 image data not returned from library picker");
    }
    let sha256hex = await storeBlob(result.base64);

    setAttachments((as) => [
      ...as,
      { role: "Other", mimeType: "image/jpeg", blob: { sha256: sha256hex } },
    ]);
  }, []);

  const partialProfileValidator = Profile.Profile.deepPartial();
  const draftProfile: z.infer<typeof partialProfileValidator> = {
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
    attachments,
  };

  const draftValidation = Profile.Profile.safeParse(draftProfile);

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
          <VStack space={2}>
            <Text>
              Upload photos of CT scans or any other relevant imagery.
            </Text>
            <Text>
              Quality is not vitally important here: photos of your computer
              screen are acceptable.
            </Text>
          </VStack>

          {attachments.map((attachment) => (
            <Entry space={2} px={2} py={2}>
              <BlobMedia hash={attachment.blob.sha256} />
              <HStack justifyContent="center" alignItems="center">
                <Button
                  variant="ghost"
                  _text={{ color: "error.700" }}
                  colorScheme="error"
                  leftIcon={<Icon as={Feather} name="trash-2" size="xs" />}
                  onPress={() => {
                    setAttachments((as) =>
                      as.filter((a) => a.blob.sha256 != attachment.blob.sha256)
                    );
                  }}
                >
                  Remove
                </Button>
              </HStack>
            </Entry>
          ))}

          <Button
            leftIcon={<Icon as={Feather} name="upload" size="sm" />}
            onPress={() => attach()}
          >
            Attach Media
          </Button>
        </VStack>
        <Text>{JSON.stringify(draftProfile, null, 4)}</Text>
        <Text>{JSON.stringify(draftValidation, null, 4)}</Text>
      </VStack>
    </KeyboardAwareScrollView>
  );
}
