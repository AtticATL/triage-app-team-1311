import { Button } from "evergreen-ui";

export default function Debug() {
  return (
    <div>
      <Button onClick={() => window.localStorage.clear()}>
        Clear LocalStorage
      </Button>
    </div>
  );
}
