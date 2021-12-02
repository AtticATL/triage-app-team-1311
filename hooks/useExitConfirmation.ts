import { useEffect } from "react";

import { confirm } from "../lib/alert";
import { useNavigation } from "@react-navigation/native";
import { NavigationProp } from "@react-navigation/core";

// Something that looks like a navigator.
interface Navlike {
  addListener(name: string, handler: (e: Eventlike) => void): any;
  dispatch: (action: any) => any;
}

// Something that looks like an event.
interface Eventlike {
  data: { action: unknown };
  preventDefault(): unknown;
}

// Confirm exits by preventing a change in navigation state with an alert.
export function useExitConfirmation(confirmExit: boolean) {
  const navigation = useNavigation<Navlike>();

  useEffect(
    () =>
      navigation.addListener("beforeRemove", (e) => {
        // Prevent default behavior of leaving the screen
        e.preventDefault();

        // Prompt the user before leaving the screen
        confirm({
          title: "Discard Changes?",
          body: "You have unsaved changes to this patient profile. Do you want to discard them?",
          reject: { text: "Don't Leave", style: "cancel" },
          accept: { text: "Discard", style: "destructive" },
        }).then((discard) => {
          if (discard) {
            // Continue with the navigation action
            navigation.dispatch(e.data.action);
          }
        });
      }),
    [navigation]
  );
}
