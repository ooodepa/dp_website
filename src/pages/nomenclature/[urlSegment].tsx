import React from 'react';
import Link from 'next/link';
import Markdown from 'react-markdown';

import NomenclatureDto, {
  emptyNomenclature_withOzonProducts,
  NomenclatureDto_withOzonProducts,
} from '@/types/api/Nomenclature.dto';
import styles from '@/styles/Nomenclature.module.css';
import AppTitle from '@/components/AppTitle/AppTitle';
import OzonProductDto from '@/types/api/OzonProduct.dto';
import AppWrapper from '@/components/AppWrapper/AppWrapper';
import AppKeywords from '@/components/AppKeywords/AppKeywords';
import AppContainer from '@/components/AppContainer/AppContainer';
import GetLibreBarcode128Text from '@/utils/GetLibreBarcode128Text';
import Nomenclatures from '@/components/Nomenclatures/Nomenclatures';
import YouTubeIframe from '@/components/YouTubeIframe/YouTubeIframe';
import AppDescription from '@/components/AppDescription/AppDescription';
import NomenclatureBreadCrumbs from '@/components/NomenclatureBreadCrumbs/NomenclatureBreadCrumbs';
import CarouselPhotos from '@/components/CarouselPhotos/CarouselPhotos';

interface IProps {
  item: NomenclatureDto_withOzonProducts;
  items: NomenclatureDto_withOzonProducts[];
}

export default function NomenclatureUrlSegment(props: IProps) {
  if (props.item.dp_1cIsFolder) {
    return (
      <AppWrapper>
        <AppTitle title={props.item.dp_seoTitle} />
        <AppDescription description={props.item.dp_seoDescription} />
        <AppKeywords keywords={props.item.dp_seoKeywords} />
        <NomenclatureBreadCrumbs model={props.item.dp_seoUrlSegment || ''} />
        <AppContainer>
          <div className={styles.wrapper}>
            <h1>{props.item.dp_seoTitle}</h1>
            <Nomenclatures items={props.items} />
          </div>
        </AppContainer>
      </AppWrapper>
    );
  }

  if (props.item) {
    const barcodes = props.item.dp_barcodes.split('\n').filter(e => e !== '');
    const youtubeIds = props.item.dp_youtubeIds
      .split('\n')
      .filter(e => e !== '');

    let md = '';

    if (props.item.dp_brand) {
      const arr = props.item.dp_brand.split('\n');
      md += `Бренд:\n- ${arr.join('\n- ')}\n\n`;
    }

    if (props.item.dp_vendorIds) {
      const arr = props.item.dp_vendorIds.split('\n');
      md += `Артикул:\n- ${arr.join('\n- ')}\n\n`;
    }

    if (props.item.dp_barcodes) {
      const arr = props.item.dp_barcodes.split('\n');
      md += `Штрихкод:\n- ${arr.join('\n- ')}\n\n`;
    }

    if (props.item.dp_youtubeIds) {
      const arr = props.item.dp_youtubeIds.split('\n');
      md += `YouTube:\n`;
      arr.forEach(youtubeId => {
        md += `- [${youtubeId}](https://youtu.be/${youtubeId})\n`;
      });
      md += '\n';
    }

    return (
      <AppWrapper>
        <AppTitle title={props.item.dp_seoTitle} />
        <AppDescription description={props.item.dp_seoDescription} />
        <AppKeywords keywords={props.item.dp_seoKeywords} />
        <NomenclatureBreadCrumbs model={props.item.dp_seoUrlSegment} />
        <AppContainer>
          <div className={styles.wrapper}>
            <h2 custom-dp-id={props.item.dp_id}>{props.item.dp_seoTitle}</h2>

            <CarouselPhotos photos={props.item.dp_photos.split('\n')} />

            <ul className={styles.ozon__ul}>
              {props.item.ozonProducts.length === 0
                ? null
                : props.item.ozonProducts.map(ozonProduct => {
                    return (
                      <li
                        key={ozonProduct.offer_id}
                        className={styles.ozon__li}>
                        <a
                          href={`https://ozon.ru/products/${ozonProduct.sku}`}
                          target="_blank"
                          className={styles.ozon__a}>
                          Купить на OZON {ozonProduct.offer_id}
                        </a>
                      </li>
                    );
                  })}
            </ul>

            {youtubeIds.length === 0 ? null : (
              <>
                <h2>YouTube видео</h2>
                <ul className={styles.youtube__ul}>
                  {youtubeIds.map(youtubeId => {
                    return (
                      <li key={youtubeId} className={styles.youtube__li}>
                        <YouTubeIframe id={youtubeId} />
                      </li>
                    );
                  })}
                </ul>
              </>
            )}

            <Markdown>{props.item.dp_markdown}</Markdown>

            {md.length > 0 ? (
              <>
                <h2>Другие данные</h2>
                <Markdown>{md}</Markdown>
              </>
            ) : null}

            {barcodes.length > 0 ? (
              <>
                <h2>Штрихкоды</h2>
                <h3>Libre Barcode EAN13 Text</h3>
                <ul className={styles.barcodes__ul}>
                  {barcodes.map(e => {
                    return (
                      <li
                        key={e}
                        className={`${styles.barcodes__li} ${styles['barcodes__li--Libre-Barcode-EAN13-Text']}`}>
                        {e}
                      </li>
                    );
                  })}
                </ul>
                <h3>Libre Barcode 128 Text</h3>
                <ul className={styles.barcodes__ul}>
                  {barcodes.map(e => {
                    return (
                      <li
                        key={e}
                        className={`${styles.barcodes__li} ${styles['barcodes__li--Libre-Barcode-128-Text']}`}>
                        {GetLibreBarcode128Text(e)}
                      </li>
                    );
                  })}
                </ul>
              </>
            ) : null}
          </div>
        </AppContainer>
      </AppWrapper>
    );
  }

  return (
    <AppWrapper>
      <AppContainer>
        <div>
          <Link href="/nomenclature">Назад</Link>
          ...
        </div>
      </AppContainer>
    </AppWrapper>
  );
}

interface IServerSideProps {
  params: {
    urlSegment: string;
  };
}

let apiCache: { [key: string]: any } = {}; // Кэш в памяти

// Функция для кэшированного запроса
async function fetchWithCache(url: string, cacheDuration = 60): Promise<any> {
  const now = Date.now();

  // Если данные в кэше и не устарели
  if (apiCache[url] && now - apiCache[url].timestamp < cacheDuration * 1000) {
    return apiCache[url].data;
  }

  // Запрашиваем новые данные
  const response = await fetch(url);

  if (response.status !== 200) {
    throw new Error(`HTTP status ${response.status}`);
  }

  const data = await response.json();

  // Сохраняем данные в кэш
  apiCache[url] = {
    data,
    timestamp: now,
  };

  return data;
}

export async function getStaticProps(context: IServerSideProps) {
  const { urlSegment } = context.params;

  try {
    const URL_ = 'https://de-pa.by/api/v1/items/pagination?limit=10000';

    // Используем кэшированный запрос
    const NOMENCLATURE_ARRAY: NomenclatureDto[] = (await fetchWithCache(URL_))
      .data;

    let item: NomenclatureDto | null = null;
    for (let i = 0; i < NOMENCLATURE_ARRAY.length; ++i) {
      const ITEM = NOMENCLATURE_ARRAY[i];
      if (ITEM.dp_seoUrlSegment == urlSegment) {
        item = ITEM;
        break;
      }
    }

    if (item == null) {
      throw new Error(`NOT FOUND ${urlSegment}`);
    }

    const ID = item.dp_id;

    const CHILDRENS = NOMENCLATURE_ARRAY.filter(
      (e: any) => e.dp_1cParentId == ID,
    ).sort((a: any, b: any) => a.dp_sortingIndex - b.dp_sortingIndex);

    const URL_OZON_PRODUCTS =
      'https://de-pa.by/api/v1/ozon-seller/info-products?limit=10000';
    const OZON_PRODUCTS: OzonProductDto[] = (
      await fetchWithCache(URL_OZON_PRODUCTS)
    ).data;

    const ITEMS_WITH_OZON_PRODUCTS: NomenclatureDto_withOzonProducts[] =
      CHILDRENS.map(nomenclature_i => {
        const ITEM_OZON_PRODUCTS: OzonProductDto[] = [];
        OZON_PRODUCTS.forEach(ozonProduct_j => {
          const MODEL_J = `${ozonProduct_j.offer_id}`.replace(/\(\d+шт\)/g, '');
          if (nomenclature_i.dp_vendorIds.includes(MODEL_J)) {
            ITEM_OZON_PRODUCTS.push(ozonProduct_j);
          }
        });
        return {
          ...nomenclature_i,
          ozonProducts: ITEM_OZON_PRODUCTS,
        };
      });

    const ITEM_OZON_PRODUCTS: OzonProductDto[] = [];
    OZON_PRODUCTS.forEach(ozonProduct_j => {
      const MODEL_J = `${ozonProduct_j.offer_id}`.replace(/\(\d+шт\)/g, '');
      if (`${item?.dp_vendorIds}`.includes(MODEL_J)) {
        ITEM_OZON_PRODUCTS.push(ozonProduct_j);
      }
    });
    const ITEM_WITH_OZON_PRODUCTS: NomenclatureDto_withOzonProducts = {
      ...item,
      ozonProducts: ITEM_OZON_PRODUCTS,
    };

    const props: IProps = {
      item: ITEM_WITH_OZON_PRODUCTS,
      items: ITEMS_WITH_OZON_PRODUCTS,
    };

    return {
      props,
      revalidate: 60, // Перегенерация страницы каждые 60 секунд
    };
  } catch (exception) {
    console.error('< < < < < < < <');
    console.error(exception);
    console.error('> > > > > > > >');
    const props: IProps = {
      item: emptyNomenclature_withOzonProducts,
      items: [],
    };
    return {
      props,
      revalidate: 60, // Перегенерация страницы каждые 60 секунд
    };
  }
}

export async function getStaticPaths() {
  try {
    const URL_ = 'https://de-pa.by/api/v1/items/pagination?limit=10000';

    // Используем кэшированный запрос
    const NOMENCLATURE_ARRAY = (await fetchWithCache(URL_)).data;

    const PARAMS = NOMENCLATURE_ARRAY.filter((e: any) => !e.dpdp_isHidden).map(
      (e: any) => {
        return {
          params: {
            urlSegment: e.dp_seoUrlSegment,
          },
        };
      },
    );

    return {
      paths: PARAMS,
      fallback: false, // Используйте обработку ошибок 404 и ISR
    };
  } catch (exception) {
    console.error('< < < < < < < <');
    console.error(exception);
    console.error('> > > > > > > >');
    return {
      paths: [],
      fallback: true, // Используйте обработку ошибок 404 и ISR
    };
  }
}
