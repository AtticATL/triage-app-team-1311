import * as React from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { NavSubProps as RootNavSubProps } from "../App";
import { Box, Center, HStack, Spinner, View, VStack } from "native-base";
import { z } from "zod";
import { Attachment } from "../lib/profile";
import { Entry } from "../components/Form";
import { Url } from "url";
// @ts-ignore
import { Image } from "native-base";
import { useMedia } from "../hooks/useMedia";

/**
 * The URL validator for the patient profile
 */

export default function ViewImageScreen({
  route,
  navigation,
}: RootNavSubProps<"ViewImage">) {
  const dataUri = useMedia(route.params.attachment.blob);

  if (dataUri == null) {
    return (
      <Box>
        <Spinner size="lg" />
      </Box>
    );
  }

  return (
    <Center>
      <Image
        style={{ width: "100%", height: 500 }}
        resizeMode="center"
        source={{ uri: dataUri }}
        alt="Image Attatchment"
      />
    </Center>
  );
}
