import YandexMetrika from '@/components/YandexMetrika/YandexMetrika';

import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin=""
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Libre+Barcode+128&family=Libre+Barcode+EAN13+Text&family=Roboto:wght@300&display=swap"
          rel="stylesheet"
        />
      </Head>
      <body>
        <YandexMetrika />
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
