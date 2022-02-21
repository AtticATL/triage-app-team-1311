import * as React from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { NavSubProps as RootNavSubProps } from "../App";
import { Text, Heading, VStack, Input, Button, Icon } from "native-base";
import { TextField, useField } from "../components/Form";
import TileButton from "../components/TileButton";
import { z } from "zod";
import { setupURLPolyfill } from "react-native-url-polyfill";
import { Feather } from "@expo/vector-icons";
import { decode } from "base-64";

setupURLPolyfill();

/**
 * The URL validator for the patient profile
 */
export const Url = z.string().url({ message: "Please insert a valid URL" });
export type Url = z.infer<typeof Url>;

export default function RecieveProfileScreen({
  navigation,
}: RootNavSubProps<"RecieveProfile">) {
  const url = useField(Url);
  const validURL = url.validator.safeParse(url.value).success;

  return (
    <VStack mx={4} mt={8} space={6}>
      <TextField
        field={url}
        label="Patient profile URL"
        help="The provided link to the wanted patient profile"
        size="2xl"
      />
      <Button
        onPress={() => {
          if (validURL) {
            let profile = JSON.parse(decode(url.value.substring(21)));
            console.log(profile);
            navigation.navigate("ViewProfile");
          }
        }}
        isDisabled={!validURL}
        py={8}
        size="lg"
        colorScheme="success"
        rightIcon={<Icon as={Feather} name="arrow-right" size="sm" />}
      >
        Continue
      </Button>
    </VStack>
  );
}
