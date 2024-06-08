import Link from 'next/link';
import { useEffect, useState } from 'react';
import styles from '@/styles/Warehouse.module.css';
import AppTitle from '@/components/AppTitle/AppTitle';
import AppWrapper from '@/components/AppWrapper/AppWrapper';
import AppKeywords from '@/components/AppKeywords/AppKeywords';
import FetchInvoice from '@/utils/FetchBackend/rest/api/invoice';
import AppContainer from '@/components/AppContainer/AppContainer';
import AppDescription from '@/components/AppDescription/AppDescription';
import { DataGetWarehousesDto } from '@/store/reducers/warehouse-reducer.dto';

const SEO_TITLE = 'Склады';
const SEO_DESCRIPTION = 'Склады';
const SEO_KEYWORDS = 'Склады';

export default function WarehousePage() {
  const [data, setData] = useState<DataGetWarehousesDto[]>([]);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<null | string>(null);

  useEffect(() => {
    (async function () {
      try {
        setIsLoaded(false);
        setIsLoading(true);
        const RESPONSE_DATA = await FetchInvoice.getWarehouses();
        setIsLoading(false);

        setData(RESPONSE_DATA.data);

        setIsLoaded(true);
      } catch (exception) {
        setError(`${exception}`);
      }
    })();
  }, []);

  if (error) {
    return (
      <AppWrapper>
        <AppContainer>
          <AppTitle title={SEO_TITLE} />
          <AppDescription description={SEO_DESCRIPTION} />
          <AppKeywords keywords={SEO_KEYWORDS} />
          <h1>{SEO_TITLE}</h1>
          <div style={{ textAlign: 'center' }}>{error}</div>
        </AppContainer>
      </AppWrapper>
    );
  }

  if (isLoading) {
    return (
      <AppWrapper>
        <AppContainer>
          <AppTitle title={SEO_TITLE} />
          <AppDescription description={SEO_DESCRIPTION} />
          <AppKeywords keywords={SEO_KEYWORDS} />
          <h1>{SEO_TITLE}</h1>
          <div style={{ textAlign: 'center' }}>Загрузка массива складов</div>
        </AppContainer>
      </AppWrapper>
    );
  }

  if (isLoaded) {
    if (data.length === 0) {
      return (
        <AppWrapper>
          <AppContainer>
            <AppTitle title={SEO_TITLE} />
            <AppDescription description={SEO_DESCRIPTION} />
            <AppKeywords keywords={SEO_KEYWORDS} />
            <h1>{SEO_TITLE}</h1>
            <div style={{ textAlign: 'center' }}>Список складов пуст</div>
          </AppContainer>
        </AppWrapper>
      );
    }

    return (
      <AppWrapper>
        <AppContainer>
          <AppTitle title={SEO_TITLE} />
          <AppDescription description={SEO_DESCRIPTION} />
          <AppKeywords keywords={SEO_KEYWORDS} />
          <h1>{SEO_TITLE}</h1>
          <ul className={styles.list__ul}>
            {data.map(e => {
              return (
                <li key={e.dp_id} className={styles.list__li}>
                  <Link
                    className={styles.list__a}
                    href={`/warehouses/${e.dp_id}`}>
                    {e.dp_name}{' '}
                    <span className={styles.list__number}>№{e.dp_id}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </AppContainer>
      </AppWrapper>
    );
  }

  return (
    <AppWrapper>
      <AppContainer>
        <AppTitle title={SEO_TITLE} />
        <AppDescription description={SEO_DESCRIPTION} />
        <AppKeywords keywords={SEO_KEYWORDS} />
        <h1>{SEO_TITLE}</h1>
        <div style={{ textAlign: 'center' }}>
          Загрузка: {isLoading ? 'да' : 'нет'}
        </div>
        <div style={{ textAlign: 'center' }}>
          Загружен: {isLoaded ? 'да' : 'нет'}
        </div>
        <div style={{ textAlign: 'center' }}>
          Ошибка: {error ? error : 'нет'}
        </div>
      </AppContainer>
    </AppWrapper>
  );
}
