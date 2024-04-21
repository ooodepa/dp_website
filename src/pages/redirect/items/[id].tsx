import { useEffect } from 'react';
import { useRouter } from 'next/router';
import FetchItems from '@/utils/FetchBackend/rest/api/items';

interface IProps {
  params: {
    id: string;
  };
}

export default function RedirectByItemId(props: IProps) {
  const route = useRouter();

  useEffect(() => {
    (async function () {
      const itemId = `${props.params.id}`;
      const jItem = await FetchItems.getById(itemId);
      route.replace(`/nomenclature/${jItem.dp_seoUrlSegment}`);
    })();
  }, [props.params.id]);

  return <div>Поиск номенклатуры по id=({props.params.id})</div>;
}

interface IServerSideProps {
  params: {
    id: string;
  };
}

export function getServerSideProps(context: IServerSideProps) {
  const { id } = context.params;
  const props: IProps = {
    params: { id },
  };

  return {
    props,
  };
}
