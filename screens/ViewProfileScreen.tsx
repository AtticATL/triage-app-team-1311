import * as React from "react";
import { Stack, Text } from "native-base";
import { NavSubProps as RootNavSubProps } from "../App";
import { Profile } from "../lib/profile";

export default function ViewProfileScreen({
  route,
  navigation,
}: RootNavSubProps<"ViewProfile">) {

  const profile:Profile = route.params.profile;

  return (
    <Stack>
      <Text>TODO: MAKE THIS SCREEN</Text>
    </Stack>
  );
}
