import * as React from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { NavSubProps as RootNavSubProps } from "../App";
import { Text, Heading, VStack, Input, Button, Icon } from "native-base";
import { TextField, useField } from "../components/Form";
import TileButton from "../components/TileButton";
import { z } from "zod";
import { Feather } from "@expo/vector-icons";
import { decodeText, decodeBase64 } from "../lib/storage/encoding";

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
          if (typeof url.value !== "undefined" && validURL) {
            let profile = JSON.parse(
              decodeText(decodeBase64(url.value.substring(21)))
            );
            navigation.navigate("ViewProfile", { profile });
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
