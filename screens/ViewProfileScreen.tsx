import * as React from "react";
import {
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
} from "native-base";
import { NavSubProps as RootNavSubProps } from "../App";
import { Profile } from "../lib/profile";
import { CHECKLIST, QUESTIONS } from "../lib/triageQuestions";
import BlobMedia from "../components/BlobMedia";
import { Entry } from "../components/Form";
import {
  Collapse,
  CollapseHeader,
  CollapseBody,
  AccordionList,
} from "accordion-collapse-react-native";

export default function ViewProfileScreen({
  route,
  navigation,
}: RootNavSubProps<"ViewProfile">) {
  const profile: Profile = route.params.profile;
  const bgProps = useColorModeValue("#DEDEDE", "#121212");

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

          <Flex direction="row" mb="2.5" mt="2.5"></Flex>

          <Collapse></Collapse>

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

          <VStack bg={bgProps} p={4} rounded={9}>
            <HStack>
              <CheckCircleIcon></CheckCircleIcon>
              <Text fontSize="2xl" ml={8}>
                Triage Checklist
              </Text>
              <ChevronDownIcon ml="auto" />
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
              onPress={() =>
                navigation.navigate("ViewImage", { attachment: attachment })
              }
            >
              <VStack>
                <Entry
                  space={2}
                  px={2}
                  py={2}
                  key={attachment.blob.hash}
                  rounded={20}
                >
                  <BlobMedia handle={attachment.blob} />
                  <HStack justifyContent="center" alignItems="center"></HStack>
                </Entry>
              </VStack>
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
