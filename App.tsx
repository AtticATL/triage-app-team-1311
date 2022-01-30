import { StatusBar } from "expo-status-bar";
import React from "react";
import { NativeBaseProvider } from "native-base";

import useCachedResources from "./hooks/useCachedResources";
import useColorScheme from "./hooks/useColorScheme";

import HomeScreen from "./screens/HomeScreen";
import NotFoundScreen from "./screens/NotFoundScreen";
import CreateProfileScreen from "./screens/CreateProfileScreen";

import { LinkingOptions } from "@react-navigation/native";
import * as Linking from "expo-linking";
import {
  NavigationContainer,
  DefaultTheme,
  DarkTheme,
} from "@react-navigation/native";
import {
  createStackNavigator,
  StackScreenProps,
} from "@react-navigation/stack";

export default function App() {
  const isLoadingComplete = useCachedResources();
  const colorScheme = useColorScheme();

  if (!isLoadingComplete) {
    return null;
  } else {
    return (
      <NativeBaseProvider>
        <NavigationContainer
          linking={linking}
          theme={colorScheme === "dark" ? DarkTheme : DefaultTheme}
        >
          <Nav.Navigator>
            <Nav.Screen
              name="Home"
              component={HomeScreen}
              options={{ headerShown: false }}
            />
            <Nav.Screen
              name="NotFound"
              component={NotFoundScreen}
              options={{ title: "Not Found" }}
            />
            <Nav.Screen
              name="CreateProfile"
              options={{
                title: "Create Profile",
              }}
              component={CreateProfileScreen}
            />
          </Nav.Navigator>
          <StatusBar />
        </NavigationContainer>
      </NativeBaseProvider>
    );
  }
}

export type NavParams = {
  Home: undefined;
  CreateProfile: undefined;
  NotFound: undefined;
};

/**
 * The navigation props passed into the child screens.
 * This includes things that react-navigation injects.
 */
export type NavSubProps<Screen extends keyof NavParams> = StackScreenProps<
  NavParams,
  Screen
>;

const Nav = createStackNavigator<NavParams>();

const linking: LinkingOptions<NavParams> = {
  prefixes: [Linking.makeUrl("/")],
  config: {
    screens: {
      Home: "/",
      CreateProfile: "create",
      NotFound: "*",
    },
  },
};
