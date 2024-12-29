import Link from 'next/link';
import Markdown from 'react-markdown';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faArrowRight } from '@fortawesome/free-solid-svg-icons';
import BasketHelper from '@/utils/BasketHelper';
import styles from '@/styles/Nomenclature.module.css';
import AppTitle from '@/components/AppTitle/AppTitle';
import AppWrapper from '@/components/AppWrapper/AppWrapper';
import FetchItems from '@/utils/FetchBackend/rest/api/items';
import AppKeywords from '@/components/AppKeywords/AppKeywords';
import AppContainer from '@/components/AppContainer/AppContainer';
import GetLibreBarcode128Text from '@/utils/GetLibreBarcode128Text';
import Nomenclatures from '@/components/Nomenclatures/Nomenclatures';
import YouTubeIframe from '@/components/YouTubeIframe/YouTubeIframe';
import AppDescription from '@/components/AppDescription/AppDescription';
import GetItemDto from '@/utils/FetchBackend/rest/api/items/dto/get-item.dto';
import { emptyGetItemDto } from '@/utils/FetchBackend/rest/api/items/dto/emptyGetItem';
import NomenclatureBreadCrumbs from '@/components/NomenclatureBreadCrumbs/NomenclatureBreadCrumbs';

interface IProps {
  item: GetItemDto;
  items: GetItemDto[];
}

export default function NomenclatureUrlSegment(props: IProps) {
  const [basket, setBasket] = useState<Record<string, number>>({});

  const route = useRouter();
  const { urlSegment } = route.query;
  const [isFolder, setIsFolder] = useState<boolean>(true);
  const [item, setItem] = useState<GetItemDto>(props.item);
  const [items, setItems] = useState<GetItemDto[]>(props.items);
  const [selectedImage, setSelectedImage] = useState<string>('');

  function leftImage() {
    const photos = item.dp_photos.split('\n').filter(e => e.length > 0);
    let index = 0;
    for (let i = 0; i < photos.length; ++i) {
      if (selectedImage === photos[i]) {
        index = i - 1;
        break;
      }
    }

    if (index < 0) {
      setSelectedImage(photos[photos.length - 1]);
      return;
    }

    setSelectedImage(photos[index]);
    return;
  }

  function rightImage() {
    const photos = item.dp_photos.split('\n').filter(e => e.length > 0);
    let index = 0;
    for (let i = 0; i < photos.length; ++i) {
      if (selectedImage === photos[i]) {
        index = i + 1;
        break;
      }
    }

    if (index >= photos.length) {
      setSelectedImage(photos[0]);
      return;
    }

    setSelectedImage(photos[index]);
    return;
  }

  useEffect(() => {
    (async function () {
      try {
        const model = '' + urlSegment;
        if (model.length === 0) return;
        if (model === 'undefined') return;
        const item = await FetchItems.filterOneByModel(model);
        setSelectedImage(
          item.dp_photos.split('\n').filter(e => e.length > 0)[0] || '',
        );
        setItem(item);
        setIsFolder(item.dp_1cIsFolder);

        if (item.dp_1cIsFolder) {
          const jItems = await FetchItems.getFolders(item.dp_id);
          const arr = jItems
            .sort((a, b) => a.dp_sortingIndex - b.dp_sortingIndex)
            .filter(e => !e.dp_isHidden);

          setItems(arr);
        }
      } catch (exception) {
        alert(exception);
      }
    })();

    try {
      const b = BasketHelper.getBasket();
      setBasket(b);
    } catch (exception) {}
  }, [urlSegment]);

  function plusInBasket() {
    BasketHelper.plus(item?.dp_seoUrlSegment || '');
    const b = BasketHelper.getBasket();
    setBasket(b);
  }

  if (isFolder) {
    return (
      <AppWrapper>
        <AppTitle title={item.dp_seoTitle} />
        <AppDescription description={item.dp_seoDescription} />
        <AppKeywords keywords={item.dp_seoKeywords} />
        <NomenclatureBreadCrumbs model={item?.dp_seoUrlSegment || ''} />
        <AppContainer>
          <div className={styles.wrapper}>
            <h1>{item?.dp_seoTitle}</h1>
            <Nomenclatures items={items} />
          </div>
        </AppContainer>
      </AppWrapper>
    );
  }

  if (item) {
    const ozonIds = item.dp_ozonIds.split('\n').filter(e => e !== '');
    const photos = item.dp_photos.split('\n').filter(e => e.length > 0);
    const modelsSynonims = item.dp_vendorIds.split('\n').filter(e => e !== '');
    const barcodes = item.dp_barcodes.split('\n').filter(e => e !== '');
    const youtubeIds = item.dp_youtubeIds.split('\n').filter(e => e !== '');
    const x = item.dp_width;
    const y = item.dp_length;
    const z = item.dp_height;
    const m = item.dp_weight;
    const brand = item.dp_brand;

    let md = '';

    if (item.dp_brand) {
      const arr = item.dp_brand.split('\n');
      md += `Бренд:\n- ${arr.join('\n- ')}\n\n`;
    }

    if (item.dp_vendorIds) {
      const arr = item.dp_vendorIds.split('\n');
      md += `Артикул:\n- ${arr.join('\n- ')}\n\n`;
    }

    if (item.dp_barcodes) {
      const arr = item.dp_barcodes.split('\n');
      md += `Штрихкод:\n- ${arr.join('\n- ')}\n\n`;
    }

    if (item.dp_ozonIds) {
      const arr = item.dp_ozonIds.split('\n');
      md += `Артикул OZON:\n`;
      arr.forEach(ozonId => {
        md += `- [${ozonId}](https://ozon.ru/products/${ozonId})\n`;
      });
      md += '\n';
    }

    if (item.dp_youtubeIds) {
      const arr = item.dp_youtubeIds.split('\n');
      md += `YouTube:\n`;
      arr.forEach(youtubeId => {
        md += `- [${youtubeId}](https://youtu.be/${youtubeId})\n`;
      });
      md += '\n';
    }

    if (x !== 0 && y !== 0 && z !== 0 && m !== 0) {
      md += `Габариты и вес (1 шт): ${x} x ${y} x ${z} | ${m} г.\n\n`;
    } else if (x !== 0 && y !== 0 && z !== 0) {
      md += `Габариты (1 шт): ${x} x ${y} x ${z}\n\n`;
    } else if (m !== 0) {
      md += `Вес (1 шт): ${m} г.\n\n`;
    }

    return (
      <AppWrapper>
        <AppTitle title={item.dp_seoTitle} />
        <AppDescription description={item.dp_seoDescription} />
        <AppKeywords keywords={item.dp_seoKeywords} />
        <NomenclatureBreadCrumbs model={item.dp_seoUrlSegment} />
        <AppContainer>
          <div className={styles.wrapper}>
            <h2 custom-dp-id={item.dp_id}>{item.dp_seoTitle}</h2>

            <div className={styles.slider__wrapper}>
              <div className={styles.slider__image_b}>
                <img
                  src={selectedImage}
                  alt=""
                  className={styles.slider__image}
                />
              </div>
              <div className={styles.slider__arrow_left}>
                <button
                  className={styles.slider__arrow_icon}
                  onClick={leftImage}>
                  <FontAwesomeIcon icon={faArrowLeft} />
                </button>
              </div>
              <div className={styles.slider__arrow_right}>
                <button
                  className={styles.slider__arrow_icon}
                  onClick={rightImage}>
                  <FontAwesomeIcon icon={faArrowRight} />
                </button>
              </div>
              <div className={styles.slider__circles}>
                {photos.map(e => {
                  return (
                    <span
                      key={e}
                      className={`${styles.slider__circle} ${
                        e === selectedImage
                          ? styles['slider__circle--selected']
                          : ''
                      }`}
                    />
                  );
                })}
              </div>
            </div>

            {item.dp_seoUrlSegment in basket ? (
              <div className={styles.basket__wrapper}>
                <Link href="/basket" className={styles.basket__button}>
                  Уже в корзине. Показать
                </Link>
              </div>
            ) : (
              <div className={styles.basket__wrapper}>
                <button
                  className={styles.basket__button}
                  onClick={plusInBasket}>
                  Добавить в корзину
                </button>
              </div>
            )}

            <ul className={styles.ozon__ul}>
              {ozonIds.length === 0
                ? null
                : ozonIds.map(ozonId => {
                    return (
                      <li key={ozonId} className={styles.ozon__li}>
                        <a
                          href={`https://ozon.ru/products/${ozonId}`}
                          target="_blank"
                          className={styles.ozon__a}>
                          Купить на OZON &quot;{ozonId}&quot;
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

            <Markdown>{item.dp_markdown}</Markdown>

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
    const NOMENCLATURE_ARRAY = (await fetchWithCache(URL_)).data;

    let item = null;
    for (let i = 0; i < NOMENCLATURE_ARRAY.length; ++i) {
      const ITEM = NOMENCLATURE_ARRAY[i];
      if (ITEM.dp_seoUrlSegment == urlSegment) {
        item = ITEM;
        break;
      }
    }

    if (!item) {
      throw new Error(`NOT FOUND ${urlSegment}`);
    }

    const ID = item.dp_id;

    const CHILDRENS = NOMENCLATURE_ARRAY.filter(
      (e: any) => e.dp_1cParentId == ID,
    ).sort((a: any, b: any) => a.dp_sortingIndex - b.dp_sortingIndex);

    const props: IProps = {
      item: item,
      items: CHILDRENS,
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
      item: emptyGetItemDto,
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
