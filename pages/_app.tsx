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
        <link rel="icon" type="image/png" sizes="256x256" href="/favicon-256.png" />
        <link rel="icon" type="image/png" sizes="128x128" href="/favicon-128.png" />
        <link rel="icon" type="image/png" sizes="64x64" href="/favicon-64.png" />
        <link rel="apple-touch-icon-precomposed" sizes="114x114" href="icons/icon-114.png" />
        <link rel="apple-touch-icon-precomposed" sizes="72x72"  href="icons/icon-72.png" />
        <link rel="shortcut icon" type="image/png" href="/favicon.ico" />
        <link rel="icon" sizes="174x174" href="favicon.icns"/>

        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="theme-color" content="white" />
        <link rel="apple-touch-icon" href="icons/icon-512.png" />

        <link rel="manifest" href="manifest.json" />
        <link rel="apple-touch-startup-image" href="splashscreens/apple-splash-2732-2048.png" media="(device-width: 1024px) and (device-height: 1366px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)"/>
        <link rel="apple-touch-startup-image" href="splashscreens/apple-splash-2048-2732.png" media="(device-width: 1024px) and (device-height: 1366px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)"/>
        <link rel="apple-touch-startup-image" href="splashscreens/apple-splash-2388-1668.png" media="(device-width: 834px) and (device-height: 1194px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)"/>
        <link rel="apple-touch-startup-image" href="splashscreens/apple-splash-1668-2388.png" media="(device-width: 834px) and (device-height: 1194px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)"/>
        <link rel="apple-touch-startup-image" href="splashscreens/apple-splash-2048-1536.png" media="(device-width: 768px) and (device-height: 1024px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)"/>
        <link rel="apple-touch-startup-image" href="splashscreens/apple-splash-1536-2048.png" media="(device-width: 768px) and (device-height: 1024px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)"/>
        <link rel="apple-touch-startup-image" href="splashscreens/apple-splash-2224-1668.png" media="(device-width: 834px) and (device-height: 1112px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)"/>
        <link rel="apple-touch-startup-image" href="splashscreens/apple-splash-1668-2224.png" media="(device-width: 834px) and (device-height: 1112px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)"/>
        <link rel="apple-touch-startup-image" href="splashscreens/apple-splash-2160-1620.png" media="(device-width: 810px) and (device-height: 1080px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)"/>
        <link rel="apple-touch-startup-image" href="splashscreens/apple-splash-1620-2160.png" media="(device-width: 810px) and (device-height: 1080px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)"/>
        <link rel="apple-touch-startup-image" href="splashscreens/apple-splash-1284-2778.png" media="(device-width: 428px) and (device-height: 926px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)"/>
        <link rel="apple-touch-startup-image" href="splashscreens/apple-splash-2778-1284.png" media="(device-width: 428px) and (device-height: 926px) and (-webkit-device-pixel-ratio: 3) and (orientation: landscape)"/>
        <link rel="apple-touch-startup-image" href="splashscreens/apple-splash-1170-2532.png" media="(device-width: 390px) and (device-height: 844px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)"/>
        <link rel="apple-touch-startup-image" href="splashscreens/apple-splash-2532-1170.png" media="(device-width: 390px) and (device-height: 844px) and (-webkit-device-pixel-ratio: 3) and (orientation: landscape)"/>
        <link rel="apple-touch-startup-image" href="splashscreens/apple-splash-1125-2436.png" media="(device-width: 375px) and (device-height: 812px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)"/>
        <link rel="apple-touch-startup-image" href="splashscreens/apple-splash-2436-1125.png" media="(device-width: 375px) and (device-height: 812px) and (-webkit-device-pixel-ratio: 3) and (orientation: landscape)"/>
        <link rel="apple-touch-startup-image" href="splashscreens/apple-splash-1242-2688.png" media="(device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)"/>
        <link rel="apple-touch-startup-image" href="splashscreens/apple-splash-2688-1242.png" media="(device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 3) and (orientation: landscape)"/>
        <link rel="apple-touch-startup-image" href="splashscreens/apple-splash-828-1792.png" media="(device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)"/>
        <link rel="apple-touch-startup-image" href="splashscreens/apple-splash-1792-828.png" media="(device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)"/>
        <link rel="apple-touch-startup-image" href="splashscreens/apple-splash-1242-2208.png" media="(device-width: 414px) and (device-height: 736px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)"/>
        <link rel="apple-touch-startup-image" href="splashscreens/apple-splash-2208-1242.png" media="(device-width: 414px) and (device-height: 736px) and (-webkit-device-pixel-ratio: 3) and (orientation: landscape)"/>
        <link rel="apple-touch-startup-image" href="splashscreens/apple-splash-750-1334.png" media="(device-width: 375px) and (device-height: 667px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)"/>
        <link rel="apple-touch-startup-image" href="splashscreens/apple-splash-1334-750.png" media="(device-width: 375px) and (device-height: 667px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)"/>
        <link rel="apple-touch-startup-image" href="splashscreens/apple-splash-640-1136.png" media="(device-width: 320px) and (device-height: 568px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)"/>
        <link rel="apple-touch-startup-image" href="splashscreens/apple-splash-1136-640.png" media="(device-width: 320px) and (device-height: 568px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)"/>
      </Head>
      <Component className="mount" {...pageProps} />
    </>
  );
}

export default MyApp;
