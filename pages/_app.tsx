import { useEffect } from "react";
import "./_app.css";
import type { AppProps } from "next/app";
import Head from "next/head";
import { login } from "../lib/firebase";

// Load the Inter UI font
import "inter-ui/inter-hinted-latin.css";

function MyApp({ Component, pageProps }: AppProps) {
  // On every pageload, try to sign in to Firebase anonymously.
  useEffect(() => {
    // Don't do any auth during SSR.
    if (process.browser) {
      login();
    }
  }, []);

  return (
    <>
      <Head>
        <meta
          name="viewport"
          content="viewport-fit=cover,user-scalable=no,width=device-width,initial-scale=1,maximum-scale=1"
        />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="theme-color" content="white" />

        <link rel="manifest" href="manifest.json" />
      </Head>
      <Component className="mount" {...pageProps} />
    </>
  );
}

export default MyApp;
