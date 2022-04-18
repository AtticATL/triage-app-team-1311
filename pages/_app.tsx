import "./_app.css";
import type { AppProps } from "next/app";
import Head from "next/head";

// Load the Inter UI font
import "inter-ui/inter-hinted-latin.css";

function MyApp({ Component, pageProps }: AppProps) {
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
