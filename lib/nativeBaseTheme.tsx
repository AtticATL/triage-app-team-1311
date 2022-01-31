import { extendTheme, StorageManager } from "native-base";

type StyleProp = { colorMode: "light" | "dark" };

const colors = {
  singletons: {
    darkText: "#ffffff",
    lightText: "#000000",
  },
};

const textColorMixin = ({ colorMode }: StyleProp) => ({
  color: colorMode === "dark" ? "singletons.darkText" : "singletons.lightText",
});

const Heading = {
  baseStyle: ({ colorMode }: StyleProp) => ({
    ...textColorMixin({ colorMode }),
  }),
};

const Text = {
  baseStyle: ({ colorMode }: StyleProp) => ({
    ...textColorMixin({ colorMode }),
  }),
};

const Input = {
  baseStyle: ({ colorMode }: StyleProp) => ({
    ...textColorMixin({ colorMode }),
  }),
};

export const nativeBaseTheme = extendTheme({
  colors,
  components: { Heading, Text, Input },
});
