import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootStoreDto } from '@/store';
import styles from './RemainingStock.module.css';
import AppWrapper from '../AppWrapper/AppWrapper';
import AppContainer from '../AppContainer/AppContainer';
import FetchItems from '@/utils/FetchBackend/rest/api/items';
import FetchInvoice from '@/utils/FetchBackend/rest/api/invoice';
import GetItemDto from '@/utils/FetchBackend/rest/api/items/dto/get-item.dto';
import { DePaByStockTypes } from '@/types/www.de-pa.by/api/v1/invoice/DePaByStockReducer.dto';

interface DataStock {
  count: number;
  info: GetItemDto | null;
}

interface StockArray {
  model: string;
  count: number;
  info: GetItemDto | null;
}

export default function RemainingStock() {
  const dispatch = useDispatch();
  const stockReduxData = useSelector(
    (state: RootStoreDto) => state.DePaByStockReducer.stock,
  );
  const [stockArr, setStockArr] = useState<StockArray[]>([]);

  useEffect(() => {
    (async function () {
      try {
        dispatch({ type: DePaByStockTypes.FETCH_DEPABY_STOCK });
        const jStock = await FetchInvoice.getReportStock();

        const vendors = Object.keys(jStock);

        const jItems = await FetchItems.filterByVendors({ vendors });

        let newStock: Record<string, DataStock> = {};
        for (let i = 0; i < vendors.length; ++i) {
          const model = vendors[i];
          const count = jStock[model];
          let info: GetItemDto | null = null;
          for (let j = 0; j < jItems.length; ++j) {
            const currentItem = jItems[j];
            const vendorIds = currentItem.dp_vendorIds.split('\n');
            for (let k = 0; k < vendorIds.length; ++k) {
              if (vendorIds[k] === model) {
                info = currentItem;
                break;
              }
            }
          }
          newStock[model] = {
            count,
            info,
          };
        }

        const arr: StockArray[] = Object.keys(newStock)
          .map(key => {
            const model = key;
            const count = newStock[model].count;
            const info = newStock[model].info;
            return { model, count, info };
          })
          .sort((a, b) => a.model.localeCompare(b.model))
          .sort((a, b) => {
            const brandA = a.info?.dp_brand;
            const brandB = b.info?.dp_brand;
            if (!brandA) return 1;
            if (!brandB) return 1;
            return brandA.localeCompare(brandB);
          });

        setStockArr(arr);
        dispatch({ type: DePaByStockTypes.FETCH_DEPABY_STOCK_SUCCESS });
      } catch (exception) {
        dispatch({
          type: DePaByStockTypes.FETCH_DEPABY_STOCK_ERROR,
          payload: '' + exception,
        });
      }
    })();
  }, []);

  if (stockReduxData.loading) {
    return (
      <AppWrapper>
        <AppContainer>
          <h2>Остатки</h2>
          <div style={{ textAlign: 'center' }}>
            Получаем остатки... Загрузка номенклатуры...
          </div>
        </AppContainer>
      </AppWrapper>
    );
  }

  if (stockReduxData.error) {
    return (
      <AppWrapper>
        <AppContainer>
          <h2>Остатки</h2>
          <div style={{ textAlign: 'center' }}>{stockReduxData.error}</div>
        </AppContainer>
      </AppWrapper>
    );
  }

  if (stockArr.length === 0) {
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
              <td>Наименование</td>
              <td>Характеристики</td>
              <td>Открыть</td>
            </tr>
          </thead>
          <tbody>
            {stockArr.map(e => {
              const { count, info, model } = e;
              const dp_photoUrl = info?.dp_photoUrl || '';
              const dp_seoTitle = info?.dp_seoTitle || '';
              const dp_textCharacteristics = info?.dp_textCharacteristics || '';
              const dp_ozonIds = info?.dp_ozonIds || '';

              if (count === 0) {
                return null;
              }

              return (
                <tr key={model}>
                  <td className={styles.table_image_td}>
                    <img
                      className={styles.table_image}
                      src={dp_photoUrl}
                      alt="x"
                    />
                  </td>
                  <td>{model}</td>
                  <td className={styles.table_count_td}>{count}</td>
                  <td>{dp_seoTitle}</td>
                  <td>{dp_textCharacteristics}</td>
                  <td className={styles.table_openOnSite_td}>
                    {info ? (
                      <Link href={`/redirect/items/model/${model}`}>
                        На сайте
                      </Link>
                    ) : null}
                    {dp_ozonIds
                      .split('\n')
                      .filter(e => e.length > 0)
                      .map(ozonId => {
                        return (
                          <a
                            key={ozonId}
                            href={`https://ozon.ru/products/${ozonId}`}
                            custom-is-ozon="1">
                            Ozon{ozonId}
                          </a>
                        );
                      })}
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
