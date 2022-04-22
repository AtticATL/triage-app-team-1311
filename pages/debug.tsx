import { Button, Pane } from "evergreen-ui";
import { nuke as nukeIdb } from "../lib/storage/local";

export default function Debug() {
  return (
    <Pane
      marginY={32}
      marginX={32}
      display="flex"
      flexDirection="column"
      gap={16}
    >
      <Button onClick={() => window.localStorage.clear()}>
        Clear LocalStorage
      </Button>

      <Button onClick={() => nukeIdb().then(() => alert("IDB cleared"))}>
        Nuke IndexedDB
      </Button>

      <Button
        onClick={() => {
          throw new Error("Error thrown from debug page");
        }}
      >
        Throw Error (test Sentry)
      </Button>
    </Pane>
  );
}
