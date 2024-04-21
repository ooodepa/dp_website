import { useEffect } from 'react';
import { useRouter } from 'next/router';
import AppWrapper from '@/components/AppWrapper/AppWrapper';
import FetchItems from '@/utils/FetchBackend/rest/api/items';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export default function NomenclatureUrlSegment() {
  const route = useRouter();
  const { id } = route.query;

  useEffect(() => {
    (async function () {
      try {
        const ID = '' + id;
        if (ID.length === 0) return;
        if (ID === 'undefined') return;
        const item = await FetchItems.getById(ID);
        if (item.dp_id === '0c56bfe0-33f4-42a2-85a5-3b14978cb728') {
          route.replace(`/nomenclature`);
        } else {
          route.replace(`/nomenclature/${item.dp_seoUrlSegment}`);
        }
      } catch (exception) {
        alert(exception);
      }
    })();
  }, [id]);

  return (
    <AppWrapper>
      <div
        style={{
          width: '100%',
          height: 'calc(100% - 65px)',
          display: 'flex',
          justifyContent: 'center',
          alignContent: 'center',
          flexWrap: 'wrap',
          color: 'var(--site-color)',
          fontSize: '4em',
        }}>
        <FontAwesomeIcon icon={faSpinner} />
      </div>
    </AppWrapper>
  );
}
