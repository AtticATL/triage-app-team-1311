import * as React from "react";
import Link from "next/link";
import { Card, Pane, Text } from "evergreen-ui";
import { emoryLightBlue, emoryMediumBlue } from "../colors";

export interface TileButtonProps {
  href: string;
  icon: React.ReactNode;
  children: string;
  secondary?: boolean;
}

export default function TileButton({
  href,
  children,
  icon,
  secondary,
}: TileButtonProps) {
  const primary = !secondary;

  const bg = primary ? emoryLightBlue : "white";
  const fg = primary ? "white" : emoryMediumBlue;

  return (
    <Link href={href} passHref>
      <Card
        is="a"
        href={href}
        display="flex"
        className="root"
        elevation={1}
        flex="1"
        height={96}
        padding={16}
        flexDirection="column"
        justifyContent="space-between"
        backgroundColor={bg}
        color={fg}
      >
        {icon}
        <Text fontSize="1.1em" color={fg}>
          {children}
        </Text>
      </Card>
    </Link>
  );
}
