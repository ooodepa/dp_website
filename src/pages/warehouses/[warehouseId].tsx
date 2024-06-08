import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  faFileContract,
  faFolderOpen,
  faImage,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { RootStoreDto } from '@/store';
import styles from '@/styles/Nomenclature.module.css';
import AppTitle from '@/components/AppTitle/AppTitle';
import AppWrapper from '@/components/AppWrapper/AppWrapper';
import FetchItems from '@/utils/FetchBackend/rest/api/items';
import AppKeywords from '@/components/AppKeywords/AppKeywords';
import FetchInvoice from '@/utils/FetchBackend/rest/api/invoice';
import AppContainer from '@/components/AppContainer/AppContainer';
import { InventoryTypes } from '@/store/reducers/inventory-reducer.dto';
import AppDescription from '@/components/AppDescription/AppDescription';
import { emptyGetItemDto } from '@/utils/FetchBackend/rest/api/items/dto/emptyGetItem';

export default function WarehousePage() {
  const route = useRouter();
  const { warehouseId } = route.query;

  const SEO_TITLE = `Остатки на складе №${warehouseId}`;
  const SEO_DESCRIPTION = `Остатки на складе №${warehouseId}`;
  const SEO_KEYWORDS = `Остатки на складе №${warehouseId}`;

  const [isEmpty, setIsEmpty] = useState(true);

  const dispatch = useDispatch();
  const inventoryRedux = useSelector(
    (state: RootStoreDto) => state.InventoryReducer,
  );

  useEffect(() => {
    (async function () {
      try {
        if (!warehouseId) return;
        const WAREHOUSE_ID = Number(`${warehouseId}`);

        dispatch({ type: InventoryTypes.FETCH_INVENTORY });
        dispatch({
          type: InventoryTypes.FETCH_INVENTORY_LOADING,
          payload: 'Загрузка остатков...',
        });
        const JSON_INVENTORY_DATA = await FetchInvoice.getReportStock({
          dp_warehouseId: WAREHOUSE_ID,
        });
        dispatch({
          type: InventoryTypes.FETCH_INVENTORY_LOADING,
          payload: 'Загрузка номенклатуры по остаткам...',
        });
        const vendorIds = JSON_INVENTORY_DATA.data.map(e => e.dp_vendorId);

        if (vendorIds.length === 0) {
          setIsEmpty(true);
          dispatch({
            type: InventoryTypes.FETCH_INVENTORY_SUCCESS,
            payload: {
              inventory: JSON_INVENTORY_DATA.data,
              items: [],
            },
          });
          return;
        }

        setIsEmpty(false);

        const JSON_ITEMS_DATA = await FetchItems.filterByVendors({
          vendors: vendorIds,
        });
        dispatch({
          type: InventoryTypes.FETCH_INVENTORY_SUCCESS,
          payload: {
            inventory: JSON_INVENTORY_DATA.data,
            items: JSON_ITEMS_DATA,
          },
        });
      } catch (exception) {
        dispatch({
          type: InventoryTypes.FETCH_INVENTORY_ERROR,
          payload: `${exception}`,
        });
      }
    })();
  }, [warehouseId]);

  if (inventoryRedux.error) {
    return (
      <AppWrapper>
        <AppContainer>
          <AppTitle title={SEO_TITLE} />
          <AppDescription description={SEO_DESCRIPTION} />
          <AppKeywords keywords={SEO_KEYWORDS} />
          <div>
            <Link href="/warehouses">Вернуться к списку складов</Link>
          </div>
          <h1>{SEO_TITLE}</h1>
          <div style={{ textAlign: 'center' }}>{inventoryRedux.error}</div>
        </AppContainer>
      </AppWrapper>
    );
  }

  if (inventoryRedux.isLoading) {
    return (
      <AppWrapper>
        <AppContainer>
          <AppTitle title={SEO_TITLE} />
          <AppDescription description={SEO_DESCRIPTION} />
          <AppKeywords keywords={SEO_KEYWORDS} />
          <div>
            <Link href="/warehouses">Вернуться к списку складов</Link>
          </div>
          <h1>{SEO_TITLE}</h1>
          <div style={{ textAlign: 'center' }}>
            {inventoryRedux.loadingStatus ||
              'Получаем остатки... Загрузка номенклатуры...'}
          </div>
        </AppContainer>
      </AppWrapper>
    );
  }

  if (inventoryRedux.isLoaded) {
    if (isEmpty) {
      return (
        <AppWrapper>
          <AppContainer>
            <AppTitle title={SEO_TITLE} />
            <AppDescription description={SEO_DESCRIPTION} />
            <AppKeywords keywords={SEO_KEYWORDS} />
            <div>
              <Link href="/warehouses">Вернуться к списку складов</Link>
            </div>
            <h1>{SEO_TITLE}</h1>
            <div style={{ textAlign: 'center' }}>Склад пуст</div>
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
          <div>
            <Link href="/warehouses">Вернуться к списку складов</Link>
          </div>
          <h1>{SEO_TITLE}</h1>
          <ul className={styles.items__ul}>
            {inventoryRedux.inventory.map(e => {
              let item = emptyGetItemDto;
              const items = inventoryRedux.items;
              for (let i = 0; i < items.length; ++i) {
                const currentItem = items[i];
                const vendorsIds = `\n${currentItem.dp_vendorIds}\n`;
                if (vendorsIds.includes(`\n${e.dp_vendorId}\n`)) {
                  item = currentItem;
                  break;
                }
              }

              const photos = item.dp_photos.split('\n');
              const mainPhoto = photos[0] || '';
              const urlSegment = item.dp_seoUrlSegment || '';
              const ozonIds = item.dp_ozonIds
                .split('\n')
                .filter(e => e.length > 0);

              return (
                <li key={e.dp_id} className={styles.items__li}>
                  <div className={styles.items__mini_icons}>
                    {ozonIds.length > 0 ? (
                      <span
                        className={`${styles.items__mini_icon} ${styles['items__mini_icon--ozon']}`}>
                        OZON
                      </span>
                    ) : null}
                  </div>
                  <Link
                    href={`/nomenclature/${item.dp_seoUrlSegment}`}
                    className={styles.items__a}>
                    <div
                      className={`${styles.items__icon} ${
                        item.dp_1cIsFolder
                          ? styles['items__icon--isFolder']
                          : styles['items__icon--isFile']
                      }`}>
                      <FontAwesomeIcon
                        icon={
                          item.dp_1cIsFolder ? faFolderOpen : faFileContract
                        }
                      />
                    </div>
                    <div className={styles.items__img_b}>
                      {mainPhoto.length === 0 ? (
                        <FontAwesomeIcon
                          icon={item.dp_1cIsFolder ? faFolderOpen : faImage}
                        />
                      ) : (
                        <img
                          src={mainPhoto}
                          alt="x"
                          className={styles.items__img}
                        />
                      )}
                    </div>
                    <div className={styles.items__img_circles}>
                      {photos.length > 1
                        ? photos.map(e => {
                            return (
                              <span
                                key={e}
                                className={styles.items__img_circle}
                              />
                            );
                          })
                        : null}
                    </div>
                    <div className={styles.items__count}>
                      Остатки: {e.dp_count}
                    </div>
                    {item.dp_1cIsFolder ? null : (
                      <div className={styles.items__urlSegment}>
                        {e.dp_vendorId}
                      </div>
                    )}
                    <div className={styles.items__text}>{item.dp_seoTitle}</div>
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
        <div>
          <Link href="/warehouses">Вернуться к списку складов</Link>
        </div>
        <h1>{SEO_TITLE}</h1>
        <div style={{ textAlign: 'center' }}>warehouseId = {warehouseId}</div>
        <div style={{ textAlign: 'center' }}>
          Загрузка: {inventoryRedux.isLoading ? 'да' : 'нет'}
        </div>
        <div style={{ textAlign: 'center' }}>
          Загружен: {inventoryRedux.isLoaded ? 'да' : 'нет'}
        </div>
        <div style={{ textAlign: 'center' }}>
          Ошибка: {inventoryRedux.error ? inventoryRedux.error : 'нет'}
        </div>
      </AppContainer>
    </AppWrapper>
  );
}
