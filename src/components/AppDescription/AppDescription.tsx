import Head from 'next/head';

interface IProps {
  description: string;
}

export default function AppDescription(props: IProps) {
  return (
    <Head>
      <meta name="description" content={`${props.description}...`} />
    </Head>
  );
}
