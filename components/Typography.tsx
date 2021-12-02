import * as React from "react";
import { StyleSheet } from "react-native";
import { Text } from "./Themed";

export interface HeadingProps {
  h1?: boolean;
  h2?: boolean;

  children: string;
}

export function Heading({ h1 = false, h2 = false, children }: HeadingProps) {
  const activeStyle = h1
    ? headingStyles.h1
    : h2
    ? headingStyles.h2
    : headingStyles.h1;

  return <Text style={[headingStyles.heading, activeStyle]}>{children}</Text>;
}

const headingStyles = StyleSheet.create({
  heading: {
    fontWeight: "bold",
  },
  h1: {
    fontSize: 34,
    marginTop: 34,
    marginBottom: 34 / 2,
  },
  h2: {
    fontSize: 28,
    marginTop: 28,
    marginBottom: 28 / 2,
  },
});
