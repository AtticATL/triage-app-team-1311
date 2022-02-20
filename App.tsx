import React from "react";
import { StatusBar } from "expo-status-bar";
import { NativeBaseProvider, useColorMode } from "native-base";
import useCachedResources from "./hooks/useCachedResources";
import HomeScreen from "./screens/HomeScreen";
import NotFoundScreen from "./screens/NotFoundScreen";
import CreateProfileScreen from "./screens/CreateProfileScreen";
import { LinkingOptions } from "@react-navigation/native";
import * as Linking from "expo-linking";
import { useColorScheme as useSystemColorScheme } from "react-native";
import {
  NavigationContainer,
  DefaultTheme,
  DarkTheme,
} from "@react-navigation/native";
import {
  createStackNavigator,
  StackScreenProps,
} from "@react-navigation/stack";
import { nativeBaseTheme } from "./lib/nativeBaseTheme";
import RecieveProfileScreen from "./screens/RecieveProfileScreen";
import ViewProfileScreen from "./screens/ViewProfileScreen";
import { Profile } from "./lib/profile";

export default function App() {
  const isLoadingComplete = useCachedResources();

  // Listen to the system color scheme, update the NativeBase theme provider
  const systemColorScheme = useSystemColorScheme();
  const colorModeManager = {
    get: async () => systemColorScheme,
    set: () => {},
  };

  return (
    <NativeBaseProvider
      theme={nativeBaseTheme}
      colorModeManager={colorModeManager}
    >
      {isLoadingComplete && <RootNav />}
    </NativeBaseProvider>
  );
}

export function RootNav() {
  const { colorMode } = useColorMode();
  return (
    <NavigationContainer
      linking={linking}
      theme={colorMode == "dark" ? DarkTheme : DefaultTheme}
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
        <Nav.Screen
          name="RecieveProfile"
          options={{
            title: "Recieve Profile",
          }}
          component={RecieveProfileScreen}
        />
        <Nav.Screen
          name="ViewProfile"
          options={{
            title: "View Profile",
          }}
          component={ViewProfileScreen}
        />
      </Nav.Navigator>
      <StatusBar />
    </NavigationContainer>
  );
}

export type NavParams = {
  Home: undefined;
  CreateProfile: undefined;
  NotFound: undefined;
  RecieveProfile: undefined;
  ViewProfile: {profile: Profile};
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
