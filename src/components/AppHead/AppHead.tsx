import AppEnv from '@/AppEnv';
import Head from 'next/head';

export default function AppHead() {
  return (
    <Head>
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <link rel="icon" href="/favicon.ico" />
      <meta
        name="yandex-verification"
        content={AppEnv.NEXT_PUBLIC__SITE_YANDEX_VERIFICATION}
      />
    </Head>
  );
}