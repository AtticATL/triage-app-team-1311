import { StatusBar } from "expo-status-bar";
import * as React from "react";
import { useCallback, useState, useRef } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  ScrollView,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import {
  Text,
  Heading,
  Alert,
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
import { storeProfile } from "../lib/profileStorage";
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
import {encode} from "base-64";

export default function CreateProfileScreen({
  navigation,
}: RootNavSubProps<"CreateProfile">) {
  // Confirm exit
  // useExitConfirmation(true); // TODO: add this back when we can disable it

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

  const submit = useCallback(() => {
    // If, by any chance, something's still wrong, throw.
    storeProfile(Profile.Profile.parse(draftProfile));
    let url = 'http://oi-triage-app/' + encode(JSON.stringify(draftProfile));
    console.log(url);
    // Pop this view off the stack.
    navigation.pop();
  }, [draftProfile]);

  return (
    <KeyboardAwareScrollView
      extraHeight={100}
      enableResetScrollToCoords={false}
    >
      <VStack mx={4} mt={4} space={8} safeAreaBottom safeAreaX pb={16}>
        <VStack space={4}>
          <Heading>Identity</Heading>

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
          <Text>
            The patient's medical history, as well as the history of the present
            infection.
          </Text>

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
            <Entry space={2} px={2} py={2} key={attachment.blob.sha256}>
              <BlobMedia hash={attachment.blob.sha256} />
              <HStack justifyContent="center" alignItems="center">
                <Button
                  variant="ghost"
                  colorScheme="danger"
                  _pressed={{ bg: "danger.400" }}
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
            leftIcon={<Icon as={Feather} name="upload" size="xs" />}
            onPress={() => attach()}
          >
            Attach Media
          </Button>
        </VStack>

        <VStack mt={8}>
          {draftValidation.success ? (
            <Button
              py={8}
              size="lg"
              colorScheme="success"
              rightIcon={<Icon as={Feather} name="arrow-right" size="sm" />}
              onPress={submit}
            >
              Submit Profile
            </Button>
          ) : (
            <Alert
              variant="solid"
              status="warning"
              colorScheme="warning"
              alignItems="stretch"
              pl={4}
              py={8}
            >
              <VStack alignItems="flex-start">
                <Icon
                  as={Feather}
                  name="alert-triangle"
                  color="white"
                  size="sm"
                />
                <Text fontSize="lg" mt={4} color="white">
                  This profile can't be submitted yet.
                </Text>
                <Text color="white" mt={2}>
                  We found these problems with the data you entered:
                </Text>
                {draftValidation.error.issues.map((issue, i) => (
                  <Text ml={4} color="white" key={i}>
                    {issue.message}
                  </Text>
                ))}
                <Text color="white" mt={3}>
                  Fix these issues to submit the profile.
                </Text>
              </VStack>
            </Alert>
          )}
        </VStack>
      </VStack>
    </KeyboardAwareScrollView>
  );
}
