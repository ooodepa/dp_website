import YandexMetrika from '@/components/YandexMetrika/YandexMetrika';

import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="en">
      <Head />
      <body>
        <YandexMetrika />
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
