import YandexMetrika from '@/components/YandexMetrika/YandexMetrika';

import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <link
          href="https://fonts.googleapis.com/css2?family=Libre+Barcode+128&family=Roboto:wght@300&display=swap"
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
