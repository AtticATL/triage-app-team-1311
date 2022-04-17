import { StatusBar } from "expo-status-bar";
import * as React from "react";
import { useCallback, useState, useRef, useEffect } from "react";
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
  Spinner,
  useToken,
} from "native-base";
import { z, ZodUndefined } from "zod";
import * as ImagePicker from "expo-image-picker";
import { Feather } from "@expo/vector-icons";

import { NavSubProps as RootNavSubProps } from "../App";

import { useExitConfirmation } from "../hooks/useExitConfirmation";

import * as Storage from "../lib/storage/storage";
import {
  encodeText,
  decodeText,
  encodeBase64,
  decodeBase64,
} from "../lib/storage/encoding";
import { deleteProfile, storeProfile } from "../lib/profileStorage";
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
import {
  FALSE_REGION_SECTIONS,
  REGIONAREAS,
  REGIONS,
} from "../lib/injuryRegions";


export default function EditProfileScreen({
  route,
  navigation,
}: RootNavSubProps<"EditProfile">) {
    const profile = route.params.profile;

    const name = useField(Profile.Name, profile.identity.name);
    const birthYear = useField(Profile.BirthYear, profile.identity.birthYear);
    const sex = useField(Profile.Sex, profile.identity.sex);
  
    const currentInfectionHistory = useField(Profile.Paragraph, profile.patientHistory.currentInfectionHistory);
    const pastHistory = useField(Profile.Paragraph, profile.patientHistory.pastHistory);
    const otherNotes = useField(Profile.Paragraph.optional(), profile.patientHistory.otherNotes);
  
    // Track the true/false answers to triage questions
    let [answers, setAnswers] =
      React.useState<Record<string, boolean>>(profile.triageChecklist);
  
    // Track the true/false regions to injury regions
    let [regions, setRegions] = React.useState<Record<string, boolean>>(
      profile.infectionRegions
    );
  
    // Store attachments
    let [uploads, setUploads] = React.useState<
      Array<{ attachment: Profile.Attachment; earlyHandle: Storage.EarlyHandle }>
    >([]);
  
    const attach = React.useCallback(async () => {
      console.log("[upload] present dialog");
  
      // No permissions request is necessary for launching the image library
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 0 /* crunch the daylights out of it with compression */,
        base64: true, // Give us the base64-encoded binary data here
      });
  
      // If they cancelled, bail out.
      if (result.cancelled) {
        return;
      }
      console.log(
        `[upload] got image attachment, ${result!.base64!.length} chars of b64`
      );
  
      // Decode the image from base64
      if (!result.base64) {
        throw new TypeError("base64 image data not returned from library picker");
      }
  
      console.log("[upload] decode image base64");
      const buf = decodeBase64(result.base64);
  
      console.log("[upload] call Storage.put");
      let earlyHandle = await Storage.put(buf);
  
      setUploads((as) => [
        ...as,
        {
          attachment: {
            role: "Other",
            mimeType: "image/jpeg",
            blob: earlyHandle.handle,
          },
          earlyHandle,
        },
      ]);
    }, [uploads]);
  
    // Track whether all the uploads are durably uploaded
    let [uploadsReady, setUploadsReady] = React.useState(false);
    React.useEffect(() => {
      let cancelled = false;
  
      // Flag uploads as not ready
      setUploadsReady(false);
  
      // Flag uploads as ready when they all complete.
      const durableProms = uploads.map(
        (u) => u.earlyHandle.waitForDurableStorage
      );
      Promise.all(durableProms).then(() => {
        if (!cancelled) {
          setUploadsReady(true);
        }
      });
  
      // If we re-evaluate the effect, never setUploadsReady
      return () => {
        cancelled = true;
      };
    }, [uploads]);
    
    const partialProfileValidator = Profile.Profile.deepPartial();
    const draftProfile: z.infer<typeof partialProfileValidator> = {
      identity: {
        name: name.value,
        birthYear: birthYear.value,
        sex: sex.value,
      },
      triageChecklist: answers,
      infectionRegions: regions,
      patientHistory: {
        currentInfectionHistory: currentInfectionHistory.value,
        pastHistory: pastHistory.value,
        otherNotes: otherNotes.value,
      },
      attachments: uploads.map((u) => u.attachment),
    };
  
    const draftValidation = Profile.Profile.safeParse(draftProfile);
  
    const submit = React.useCallback(async () => {

      // Remove orginal profile
      await deleteProfile(profile);

      // If, by any chance, something's still wrong, throw.
      await storeProfile(Profile.Profile.parse(draftProfile));
      let url =
        "http://oi-triage-app/" +
        encodeBase64(encodeText(JSON.stringify(draftProfile)));
      console.log(url);
      // Pop this view off the stack.
      navigation.navigate("Home");
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
            <Heading>Infection Regions</Heading>
            <Text>
              Designate the affected regions of the face for the patient's
              odontogenic injury.
            </Text>
  
            <Entry space={4}>
              {REGIONS.map((id) => (
                <Checkbox
                  key={id}
                  value={regions[id]}
                  label={REGIONAREAS[id].text}
                  onChange={(v) => setRegions((a) => ({ ...a, [id]: v }))}
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
  
            {uploads.map(({ attachment, earlyHandle }) => (
              <Entry space={2} px={2} py={2} key={attachment.blob.id}>
                <BlobMedia handle={attachment.blob} />
                <HStack justifyContent="center" alignItems="center">
                  <Button
                    variant="ghost"
                    colorScheme="danger"
                    _pressed={{ bg: "danger.400" }}
                    leftIcon={<Icon as={Feather} name="trash-2" size="xs" />}
                    onPress={() => {
                      setUploads((us) =>
                        us.filter(
                          (u) => u.attachment.blob.id != attachment.blob.id
                        )
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
  
          <VStack mt={8} space={4}>
            {uploadsReady && draftValidation.success && (
              <Button
                py={8}
                size="lg"
                colorScheme="success"
                rightIcon={<Icon as={Feather} name="arrow-right" size="sm" />}
                onPress={submit}
              >
                Submit Profile
              </Button>
            )}
  
            {!uploadsReady && (
              <Alert variant="solid" status="success" alignItems="stretch">
                <HStack space={4}>
                  <Icon
                    as={Feather}
                    name="upload-cloud"
                    color="white"
                    size="sm"
                  />
                  <Text color="white">Uploading attachments...</Text>
                  <Spinner
                    ml={"auto"}
                    color="white"
                    accessibilityLabel="Uploading attachments"
                  />
                </HStack>
              </Alert>
            )}
  
            {!draftValidation.success && (
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