import { Html, Head, Main, NextScript } from 'next/document';
import Script from 'next/script';

export default function Document() {
  return (
    <Html>
      <Head>
        <link rel='shortcut icon' href='/icons/icon-plane.png' />
      </Head>
      <Head>
        <meta http-equiv='Content-Security-Policy' content='upgrade-insecure-requests' />
      </Head>
      <body>
        <Main />
        <NextScript />
        {/* <Script src='https://app.embed.im/snow.js' strategy='beforeInteractive' /> */}
      </body>
    </Html>
  );
}
