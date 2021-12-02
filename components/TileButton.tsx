import * as React from "react";
import { Feather } from "@expo/vector-icons";
import { View, Text, StyleSheet, Pressable } from "react-native";
import * as colors from "../constants/Colors";

export interface TileButtonStyleProps {
  title: string;
  icon: React.ComponentProps<typeof Feather>["name"];
  light?: boolean;
}

export interface TileButtonProps extends TileButtonStyleProps {
  onPress: () => unknown;
}

export default function TileButton({ onPress, ...rest }: TileButtonProps) {
  return (
    <Pressable onPress={onPress}>
      {({ pressed }) => <TileButtonDisplay {...rest} pressed={pressed} />}
    </Pressable>
  );
}

export function TileButtonDisplay({
  icon,
  title,
  light,
  pressed,
}: TileButtonStyleProps & { pressed: boolean }) {
  // Get the active stylesheet
  const s = light
    ? pressed
      ? styleLightPressed
      : styleLightNormal
    : pressed
    ? styleDarkPressed
    : styleDarkNormal;

  return (
    <View style={[styles.button, s.button]}>
      <Feather name={icon} size={25} style={[styles.icon, s.text]} />
      <Text style={[styles.text, s.text]}>{title}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  button: {
    width: "100%",
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    justifyContent: "center",
    marginVertical: 10,
    borderRadius: 10,
    padding: 15,
  },
  text: {
    fontSize: 20,
  },
  icon: {
    marginBottom: 20,
  },
});

const styleDarkNormal = StyleSheet.create({
  button: { backgroundColor: colors.emoryLightBlue },
  text: { color: "white" },
});

const styleLightNormal = StyleSheet.create({
  button: { backgroundColor: "white" },
  text: { color: colors.emoryMediumBlue },
});

const styleDarkPressed = StyleSheet.create({
  button: { backgroundColor: colors.emoryMediumBlue },
  text: { color: "white" },
});

const styleLightPressed = StyleSheet.create({
  button: { backgroundColor: "#ccc" },
  text: { color: colors.emoryMediumBlue },
});
