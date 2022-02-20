import * as React from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { NavSubProps as RootNavSubProps } from "../App";
import { Text, Heading, VStack, Input, Button } from "native-base";
import { TextField } from "../components/Form";
import TileButton from "../components/TileButton";

export default function RecieveProfileScreen({
  navigation,
}: RootNavSubProps<"RecieveProfile">) {
  const url = "";

  return (
    <VStack mx={4} mt={4} space={8} safeAreaBottom safeAreaX pb={16}>
      <Text>INSRET INSTRUCTIONS HERE</Text>
      <Input placeholder="URL"></Input>
      <Button
        onPress={() => {
          // console.log('Click')
          navigation.navigate("ViewProfile");
        }}
      >
        <Text>Continue</Text>
      </Button>
    </VStack>
  );
}
