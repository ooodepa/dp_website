import Link from 'next/link';
import { useEffect, useState } from 'react';
import styles from './RemainingStock.module.css';
import AppWrapper from '../AppWrapper/AppWrapper';
import AppContainer from '../AppContainer/AppContainer';
import FetchInvoice from '@/utils/FetchBackend/rest/api/invoice';

export default function RemainingStock() {
  const [stock, setStock] = useState<Record<string, number>>({});

  useEffect(() => {
    (async function () {
      const jStock = await FetchInvoice.getReportStock();
      setStock(jStock);
    })();
  }, []);

  if (Object.keys(stock).length === 0) {
    return (
      <AppWrapper>
        <AppContainer>
          <h2>Остатки</h2>
          <div style={{ textAlign: 'center' }}>Склад пуст</div>
        </AppContainer>
      </AppWrapper>
    );
  }

  return (
    <AppWrapper>
      <AppContainer>
        <h2>Остатки</h2>
        <table className={styles.table}>
          <thead>
            <tr>
              <td>Картинка</td>
              <td>Модель</td>
              <td>Остатки</td>
              <td>Открыть на сайте</td>
            </tr>
          </thead>
          <tbody>
            {Object.keys(stock).map(model => {
              const count = stock[model];
              if (count === 0) {
                return null;
              }

              return (
                <tr key={model}>
                  <td className={styles.table_image_td}>
                    <img
                      className={styles.table_image}
                      src={`https://de-pa.by/api/v1/items/image/model/${model}`}
                      alt="x"
                    />
                  </td>
                  <td>{model}</td>
                  <td className={styles.table_count_td}>{count}</td>
                  <td className={styles.table_openOnSite_td}>
                    <Link href={`/redirect/items/model/${model}`}>Открыть</Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </AppContainer>
    </AppWrapper>
  );
}
