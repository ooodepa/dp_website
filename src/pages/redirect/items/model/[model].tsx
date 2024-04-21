import { useEffect } from 'react';
import { useRouter } from 'next/router';

interface IProps {
  params: {
    model: string;
  };
}

export default function RedirectByItemModel(props: IProps) {
  const route = useRouter();

  useEffect(() => {
    (async function () {
      const model = `${props.params.model}`;
      route.replace(`/nomenclature/${model}`);
    })();
  }, [props.params.model]);

  return <div>Поиск номенклатуры ({props.params.model})</div>;
}

interface IServerSideProps {
  params: {
    model: string;
  };
}

export function getServerSideProps(context: IServerSideProps) {
  const { model } = context.params;
  const props: IProps = {
    params: { model },
  };

  return {
    props,
  };
}
