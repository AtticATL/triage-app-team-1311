import Head from "next/head";
import * as React from "react";
import Container from "./Container";
import NavBar from "./NavBar";
import { shade } from "../colors";

export interface ScreenFrameProps {
  title: string;
  description?: string;
  children: React.ReactNode;
}

export default function ScreenFrame({
  title,
  description,
  children,
}: ScreenFrameProps) {
  return (
    <main>
      <Head>
        <title>{`${title} | TransferApp`}</title>
        {description && <meta name="description" content={description} />}
      </Head>
      <NavBar title={title} />
      <Container>{children}</Container>

      <style jsx>{`
        main {
          background-color: ${shade};
          flex: 1;
        }
      `}</style>
    </main>
  );
}
