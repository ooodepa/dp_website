import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { faImage } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { RootStoreDto } from '@/store';
import styles from '@/styles/RemainingStock.module.css';
import AppWrapper from '@/components/AppWrapper/AppWrapper';
import AppContainer from '@/components/AppContainer/AppContainer';
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

export default function RemainingStockPage() {
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
        <h1>Остатки</h1>
        <ul className={styles.stock__ul}>
          {stockArr.map(e => {
            const { count, info, model } = e;
            const photos = info?.dp_photos.split('\n') || [];
            const mainPhoto = photos[0] || '';
            const name = info?.dp_seoTitle || 'Нет данных в базе данных';
            const urlSegment = info?.dp_seoUrlSegment || '';
            const ozonIds =
              info?.dp_ozonIds.split('\n').filter(e => e.length > 0) || [];
            const synonims =
              info?.dp_vendorIds.split('\n').filter(e => e.length > 0) || [];

            if (e.count <= 0) {
              return null;
            }

            return (
              <li key={e.model} className={styles.stock__li}>
                <div className={styles.stock__img_and_model}>
                  <div
                    className={styles.stock__img_b}
                    custom-img-counter={'' + photos.length}>
                    {mainPhoto.length === 0 ? (
                      <FontAwesomeIcon icon={faImage} />
                    ) : (
                      <Link href={`/nomenclature/${urlSegment}`}>
                        <img
                          src={mainPhoto}
                          alt="no img"
                          className={styles.stock__img}
                        />
                      </Link>
                    )}
                  </div>
                  <div className={styles.stock__info_b}>
                    <div className={styles.stock__model}>{model}</div>
                    {info ? (
                      <>
                        <div>Наименование: {name}</div>
                        <div>Синонимы: {synonims.join(' | ')}</div>
                        <div>
                          На сайт:{' '}
                          <Link
                            href={`/nomenclature/${urlSegment}`}>{`/nomenclature/${urlSegment}`}</Link>
                        </div>
                      </>
                    ) : null}

                    <div>Остатки: {count}</div>
                  </div>
                </div>
                {info ? (
                  <div className={styles.stock__links}>
                    {/* <Link href={`/nomenclature/${urlSegment}`} className={styles.stock__a}>Перейти на страницу</Link> */}
                    {ozonIds.map(ozonId => {
                      return (
                        <a
                          key={ozonId}
                          href={`https://ozon.ru/products/${ozonId}`}
                          className={`${styles.stock__a} ${styles['stock__a--ozon']}`}>
                          Купить на OZON
                          <br />
                          (Артикул {ozonId})
                        </a>
                      );
                    })}
                  </div>
                ) : null}
              </li>
            );
          })}
        </ul>
      </AppContainer>
    </AppWrapper>
  );
}
