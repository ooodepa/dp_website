import { useEffect, useState } from 'react';
import FetchBackend from '@/utils/FetchBackend';
import styles from './OzonSellerProducts.module.css';
import AppContainer from '../AppContainer/AppContainer';

interface OzonSeller__InfoProduct {
  id: number;
  name: string;
  offer_id: string;
  barcode: string;
  buybox_price: string;
  category_id: number;
  created_at: string;
  images: string;
  marketing_price: string;
  min_ozon_price: string;
  old_price: string;
  premium_price: string;
  price: string;
  recommended_price: string;
  min_price: string;
  sources: string;
  stocks__coming: number;
  stocks__present: number;
  stocks__reserved: number;
  errors: string;
  vat: string;
  visible: boolean;
  visibility_details__has_price: boolean;
  visibility_details__has_stock: boolean;
  visibility_details__active_product: boolean;
  price_index: string;
  commissions: string;
  volume_weight: string;
  is_prepayment: boolean;
  is_prepayment_allowed: boolean;
  images360: string;
  color_image: string;
  primary_image: string;
  status: string;
  state: string;
  service_type: string;
  fbo_sku: number;
  fbs_sku: number;
  currency_code: string;
  is_kgt: boolean;
  discounted_stocks__coming: number;
  discounted_stocks__present: number;
  discounted_stocks__reserved: number;
  is_discounted: boolean;
  has_discounted_item: boolean;
  barcodes: string;
  updated_at: string;
  price_indexes: string;
  sku: number;
  description_category_id: number;
  type_id: number;
  is_archived: boolean;
  is_autoarchived: boolean;
  _raw_json: string;
}

export default function OzonSellerProductsPage() {
  const [ozonProducts, setOzonProducts] = useState<OzonSeller__InfoProduct[]>(
    [],
  );
  const [isFetch, setIsFetch] = useState<boolean>(false);
  const [isLoaded, seIsLoaded] = useState<boolean>(false);
  const [error, setError] = useState<null | string>(null);
  useEffect(() => {
    (async function () {
      try {
        setIsFetch(true);
        const RESULT = await FetchBackend(
          'none',
          'GET',
          `ozon-seller/products/info-products`,
        );
        const RESPONSE = RESULT.response;

        if (RESPONSE.status !== 200) {
          throw new Error(`HTTP status ${RESPONSE.status}`);
        }

        const JSON_: OzonSeller__InfoProduct[] = await RESPONSE.json();
        const SORTED_ARRAY = JSON_.filter(e => !e.is_archived)
          .filter(e => !e.is_autoarchived)
          .sort((a, b) => {
            return a.offer_id.localeCompare(a.offer_id);
          })
          .sort((a, b) => {
            return b.stocks__present - a.stocks__present;
          });

        setIsFetch(false);
        seIsLoaded(true);
        setOzonProducts(SORTED_ARRAY);
      } catch (exception) {
        setError(`${exception}`);
        setIsFetch(false);
        seIsLoaded(false);
        console.log(exception);
      }
    })();
  }, []);

  if (error) {
    <AppContainer>
      <pre style={{ color: 'red' }}>{error}</pre>
    </AppContainer>;
  }

  if (!isFetch && !isLoaded) {
    return (
      <AppContainer>
        <p>Загрузка еще не начата</p>
      </AppContainer>
    );
  }

  if (isFetch) {
    return (
      <AppContainer>
        <p>Идет загрузка...</p>
      </AppContainer>
    );
  }

  return (
    <AppContainer>
      <h2>Продукция на OZON</h2>
      <ul className={styles.ul}>
        {ozonProducts.map(e => {
          const HREF = `https://ozon.ru/products/${e.sku}`;
          const PRIMARY_IMAGE = e.primary_image;
          return (
            <li className={styles.li} key={e.id}>
              <div className={styles.wrapper}>
                <div className={styles.content}>
                  <div className={styles.post__image_b}>
                    <img
                      className={styles.post__image}
                      src={PRIMARY_IMAGE}
                      alt=""
                    />
                  </div>
                  <div className={styles.post__name}>{e.name}</div>
                  <div className={styles.post__count}>
                    Остатки: {e.stocks__present}
                  </div>
                </div>
                <div className={styles.footer}>
                  {e.sku == 0 ? null : (
                    <a href={HREF} className={styles.a}>
                      Заказать на OZON
                    </a>
                  )}
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </AppContainer>
  );
}
