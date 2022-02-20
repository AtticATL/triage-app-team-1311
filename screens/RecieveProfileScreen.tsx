import * as React from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { NavSubProps as RootNavSubProps } from "../App";
import { Text, Heading, VStack, Input, Button } from "native-base";
import { TextField, useField } from "../components/Form";
import TileButton from "../components/TileButton";
import { z } from "zod";
import { setupURLPolyfill } from 'react-native-url-polyfill';

setupURLPolyfill();

/**
 * The URL validator for the patient profile
 */
export const Url = z
    .string()
    .url({ message: "Please insert a valid URL"});
export type Url = z.infer<typeof Url>

export default function RecieveProfileScreen({
  navigation,
}: RootNavSubProps<"RecieveProfile">) {

  const url = useField(Url);

  return (
    <VStack mx={4} mt={4} space={8} safeAreaBottom safeAreaX pb={16}>
      <Text>INSERT INSTRUCTIONS HERE</Text>
      <TextField field={url}
                label="Patient profile URL"
                help="The provided link to the wanted patient profile"
                size="2xl"
      />
      <Button
        onPress={() => {
          console.log('Click')
          navigation.navigate("ViewProfile");
        }}
      >
        <Text>Continue</Text>
      </Button>
    </VStack>
  );
}
