import * as React from "react";
import {
  Alert,
  Checkbox,
  CheckCircleIcon,
  ChevronDownIcon,
  Flex,
  HamburgerIcon,
  Heading,
  HStack,
  InfoIcon,
  Pressable,
  ScrollView,
  Text,
  useColorModeValue,
  VStack,
  WarningIcon,
  WarningTwoIcon,
} from "native-base";
import { NavSubProps as RootNavSubProps } from "../App";
import { Profile } from "../lib/profile";
import { CHECKLIST, QUESTIONS } from "../lib/triageQuestions";
import BlobMedia from "../components/BlobMedia";
import { Entry } from "../components/Form";
import { REGIONAREAS, REGIONS } from "../lib/injuryRegions";

export default function ViewProfileScreen({
  route,
  navigation,
}: RootNavSubProps<"ViewProfile">) {
  const profile: Profile = route.params.profile;

  // Figure out how many regions and triage entries are checked off,
  // and based on that whether the patient is urgent
  var nRegions: number = 0;
  Object.values(profile.infectionRegions).forEach((region) => {
    if (region) {
      nRegions++;
    }
  });
  const urgentDueToRegions = nRegions > 1;
  
  var nTriage: number = 0;
  Object.values(profile.triageChecklist).forEach((triageItem) => {
    if (triageItem) {
      nTriage++;
    }
  });
  const urgentDueToTriage =  nTriage > 1;

  // Color values to conditionally set the urgent area
  const warningColor = "#ea580c";
  const bgProps = useColorModeValue("#DEDEDE", "#121212");
  const textProps = useColorModeValue("#000000", "#FFFFFF");
  const triageColorSwitch = () => {return urgentDueToTriage ? "#FFFFFF" : textProps};
  const regionColorSwitch = () => {return urgentDueToRegions ? "#FFFFFF" : textProps};

  return (
    <ScrollView>
      <VStack p={8} space={8}>
        <Heading size="xl">Patient Profile</Heading>

        <VStack space={4}>
          <Text fontSize="xl" bold>
            {profile.identity.name}
          </Text>

          <HStack alignItems="center">
            <Text fontSize="md" color="#6F6F6F">
              AGE{" "}
            </Text>
            <Text fontSize="lg">
              {new Date().getFullYear() - profile.identity.birthYear}
            </Text>
            <Text fontSize="md" color="#6F6F6F">
              {" "}
              SEX
            </Text>
            <Text fontSize="lg"> {profile.identity.sex}</Text>
          </HStack>

          {(urgentDueToRegions || urgentDueToTriage) && (
            <Alert
              variant="solid"
              status="warning"
              colorScheme="warning"
              alignItems="stretch"
              pl={4}
            >
              <HStack space={3}>
                <Alert.Icon pt={6} />
                <Text fontSize="lg" color="white" pr={10}>
                  NOTICE: This patient is reported to have a severe/multiple
                  infection(s).
                </Text>
              </HStack>
            </Alert>
          )}

          {!(urgentDueToRegions || urgentDueToTriage) && (
            <Flex direction="row" mb="2.5" mt="2.5"></Flex>
          )}

          <VStack bg={bgProps} p={4} rounded={9}>
            <HStack>
              <InfoIcon></InfoIcon>
              <Text fontSize="2xl" ml={8}>
                History
              </Text>
              <ChevronDownIcon ml="auto" />
            </HStack>
          </VStack>

          <VStack p={5} space={5}>
            <VStack>
              <Text fontSize="lg" bold>
                Medical History:
              </Text>
              <Text fontSize="lg">{profile.patientHistory.pastHistory}</Text>
            </VStack>

            <VStack>
              <Text fontSize="lg" bold>
                History of Current Infection:
              </Text>
              <Text fontSize="lg">
                {profile.patientHistory.currentInfectionHistory}
              </Text>
            </VStack>
          </VStack>

          <VStack bg={urgentDueToTriage ? warningColor : bgProps} p={4} rounded={9}>
            <HStack>
              <CheckCircleIcon color={triageColorSwitch()}></CheckCircleIcon>
              <Text fontSize="2xl" color={triageColorSwitch()} ml={8}>
                Triage Checklist
              </Text>
              <ChevronDownIcon color={triageColorSwitch()} ml="auto" />
            </HStack>
          </VStack>

          <VStack p={4} space={4}>
            {CHECKLIST.map((id) => (
              <Checkbox
                isReadOnly
                colorScheme="dark"
                value={id}
                key={id}
                isChecked={profile.triageChecklist[id]}
              >
                <Text fontSize="md">{"  " + QUESTIONS[id].text}</Text>
              </Checkbox>
            ))}
          </VStack>

          <VStack bg={urgentDueToRegions ? warningColor :bgProps} p={4} rounded={9}>
            <HStack>
              <WarningTwoIcon color={regionColorSwitch()}></WarningTwoIcon>
              <Text fontSize="2xl" color={regionColorSwitch()} ml={8}>
                Injury Regions
              </Text>
              <ChevronDownIcon color={regionColorSwitch()} ml="auto" />
            </HStack>
          </VStack>

          <VStack p={4} space={4}>
            {REGIONS.map((id) => (
              <Checkbox
                isReadOnly
                colorScheme="dark"
                value={id}
                key={id}
                isChecked={profile.infectionRegions[id]}
              >
                <Text fontSize="md">{"  " + REGIONAREAS[id].text}</Text>
              </Checkbox>
            ))}
          </VStack>

          <VStack bg={bgProps} p={4} rounded={9}>
            <HStack>
              <HamburgerIcon></HamburgerIcon>
              <Text fontSize="2xl" ml={8}>
                Imagery
              </Text>
              <ChevronDownIcon ml="auto" />
            </HStack>
          </VStack>

          {profile.attachments.map((attachment) => (
            <Pressable
              key={attachment.blob.id}
              onPress={() =>
                navigation.navigate("ViewImage", { attachment: attachment })
              }
            >
              <Entry space={2} px={2} py={2} rounded={20}>
                <BlobMedia handle={attachment.blob} />
              </Entry>
            </Pressable>
          ))}

          <VStack bg={bgProps} p={4} rounded={9}>
            <HStack>
              <WarningIcon></WarningIcon>
              <Text fontSize="2xl" ml={8}>
                Other Notes
              </Text>
              <ChevronDownIcon ml="auto" />
            </HStack>
          </VStack>

          <VStack p={5} space={5}>
            <Text fontSize="lg">{profile.patientHistory.otherNotes}</Text>
          </VStack>
        </VStack>
      </VStack>
    </ScrollView>
  );
}
