import * as React from "react";
import { StyleSheet, TouchableOpacity } from "react-native";
import { Text, Box } from "native-base";

import { NavSubProps as RootNavSubProps } from "../App";

export default function NotFoundScreen({
  navigation,
}: RootNavSubProps<"NotFound">) {
  return (
    <Box my="lg">
      <Text style={styles.fourzerofour}>404</Text>
      <Text style={styles.title}>This screen doesn't exist.</Text>
      <Text>
        You may have tapped a broken link, or this screen might have been
        removed.
      </Text>
      <TouchableOpacity
        onPress={() => navigation.replace("Home")}
        style={styles.link}
      >
        <Text style={styles.linkText}>Go Home</Text>
      </TouchableOpacity>
    </Box>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  fourzerofour: {
    fontSize: 80,
    fontWeight: "200",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  link: {
    marginTop: 15,
    paddingVertical: 15,
  },
  linkText: {
    fontSize: 14,
    color: "#2e78b7",
  },
});
