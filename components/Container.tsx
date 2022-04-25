import { Pane } from "evergreen-ui";
import * as React from "react";

export default function Container({
  children,
  ...rest
}: React.ComponentProps<typeof Pane>) {
  return (
    <Pane
      position="relative"
      maxWidth={800}
      paddingX={16}
      marginX="auto"
      {...rest}
    >
      {children}
    </Pane>
  );
}
