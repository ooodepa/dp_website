import Head from 'next/head';

interface IProps {
  keywords: string;
}

export default function AppKeywords(props: IProps) {
  return (
    <Head>
      <meta name="keywords" content={`${props.keywords}`} />
    </Head>
  );
}
