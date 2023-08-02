import Head from 'next/head';

import AppEnv from '@/AppEnv';

interface IProps {
  title: string;
}

export default function AppTitle(props: IProps) {
  const TITLE: string = `${props.title} | ${AppEnv.NEXT_PUBLIC__SITE_TITLE}`;
  return (
    <Head>
      <title>{TITLE}</title>
    </Head>
  );
}
