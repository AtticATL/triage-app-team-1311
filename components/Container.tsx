import * as React from "react";
import { View, KeyboardAvoidingView, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export interface ContainerProps {
  // The children to render inside the container
  children: React.ReactNode;

  // Should we use a SafeAreaView to wrap this content?
  safe?: boolean;

  // Should we add horizontal margin?
  margin?: boolean;

  // Should we add padding to avoid the keyboard?
  avoidKeyboard?: boolean;
}

export default function Container({
  children,
  safe = false,
  margin = false,
}: ContainerProps) {
  let view = <>{children}</>;

  // If they passed `margin`, apply horizontal margin
  if (margin) {
    view = <View style={styles.margin}>{view}</View>;
  }

  // If they passed `safe`, wrap in a SafeAreaView
  if (safe) {
    view = <SafeAreaView>{view}</SafeAreaView>;
  }

  return view;
}

const styles = StyleSheet.create({
  margin: {
    marginHorizontal: 18,
  },
});
