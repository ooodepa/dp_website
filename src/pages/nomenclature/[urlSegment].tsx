import Link from 'next/link';
import Markdown from 'react-markdown';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import BasketHelper from '@/utils/BasketHelper';
import styles from '@/styles/Nomenclature.module.css';
import AppWrapper from '@/components/AppWrapper/AppWrapper';
import FetchItems from '@/utils/FetchBackend/rest/api/items';
import AppContainer from '@/components/AppContainer/AppContainer';
import Nomenclatures from '@/components/Nomenclatures/Nomenclatures';
import { downloadFile } from '@/utils/DownloadOnBrowser/DownloadOnBrowser';
import GetItemDto from '@/utils/FetchBackend/rest/api/items/dto/get-item.dto';
import NomenclatureBreadCrumbs from '@/components/NomenclatureBreadCrumbs/NomenclatureBreadCrumbs';
import HttpException from '@/utils/FetchBackend/HttpException';
import { emptyGetItemDto } from '@/utils/FetchBackend/rest/api/items/dto/emptyGetItem';
import AppTitle from '@/components/AppTitle/AppTitle';
import AppDescription from '@/components/AppDescription/AppDescription';
import AppKeywords from '@/components/AppKeywords/AppKeywords';
import AppHead from '@/components/AppHead/AppHead';

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

  useEffect(() => {
    (async function () {
      try {
        const model = '' + urlSegment;
        if (model.length === 0) return;
        if (model === 'undefined') return;
        const item = await FetchItems.filterOneByModel(model);
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

  function EventDownloadFile() {
    downloadFile(
      `Номенклатура_${item?.dp_id}_${item?.dp_seoUrlSegment}.json`,
      JSON.stringify(items, null, 2),
    );
  }

  if (isFolder) {
    return (
      <AppWrapper>
        <AppTitle title={item.dp_seoTitle} />
        <AppDescription description={item.dp_seoDescription} />
        <AppKeywords keywords={item.dp_seoKeywords} />
        <AppHead />
        <NomenclatureBreadCrumbs model={item?.dp_seoUrlSegment || ''} />
        <AppContainer>
          <div className={styles.wrapper}>
            <h1>{item?.dp_seoTitle}</h1>
            <Nomenclatures items={items} />
            <details>
              <summary style={{ color: 'lightgray' }}>Другие данные</summary>
              <p>
                <b>ID</b>: {item?.dp_id}
              </p>
              <p>
                <b>Сегмент ссылки</b>: &quot;{item?.dp_seoUrlSegment}&quot;
              </p>
              <p>
                <b>Заголовок</b>: {item?.dp_seoTitle}
              </p>
              <p>
                <b>Описание:</b>
              </p>
              {item?.dp_seoDescription.split('\n').map(p => {
                return <p key={p}>{p}</p>;
              })}
              <p>
                <b>Ключевые слова:</b>
              </p>
              {item?.dp_seoUrlSegment.split('\n').map(p => {
                return <p key={p}>{p}</p>;
              })}
              <button onClick={EventDownloadFile}>
                Скачать данные как JSON
              </button>
            </details>
          </div>
        </AppContainer>
      </AppWrapper>
    );
  }

  if (item) {
    const ozonIds = item.dp_ozonIds.split('\n').filter(e => e !== '');
    const photos = item.dp_photos.split('\n').filter(e => e !== '');
    const modelsSynonims = item.dp_vendorIds.split('\n').filter(e => e !== '');
    const barcodes = item.dp_barcodes.split('\n').filter(e => e !== '');
    const x = item.dp_width;
    const y = item.dp_length;
    const z = item.dp_height;
    const m = item.dp_weight;
    const brand = item.dp_brand;

    return (
      <AppWrapper>
        <AppTitle title={item.dp_seoTitle} />
        <AppDescription description={item.dp_seoDescription} />
        <AppKeywords keywords={item.dp_seoKeywords} />
        <AppHead />
        <NomenclatureBreadCrumbs model={item.dp_seoUrlSegment} />
        <AppContainer>
          <div className={styles.wrapper}>
            <h2 custom-dp-id={item.dp_id}>{item.dp_seoTitle}</h2>

            {photos.length === 0 ? null : (
              <ul className={styles.photos__ul}>
                {photos.map(e => {
                  return (
                    <li key={e} className={styles.photos__li}>
                      <img src={e} alt="x" className={styles.photos__img} />
                    </li>
                  );
                })}
              </ul>
            )}

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

            {modelsSynonims.length === 0 ? null : (
              <p>
                <b>Список синонимов артикула</b>: {modelsSynonims.join('; ')}.
              </p>
            )}
            {barcodes.length === 0 ? null : (
              <p>
                <b>Штрихкоды</b>: {barcodes.join(', ')}.
              </p>
            )}
            {x === 0 && y === 0 && z === 0 ? null : (
              <p>
                <b>Габариты (1 шт)</b>: {x} x {y} x {z} мм, {m} г
              </p>
            )}
            {brand.length === 0 ? null : (
              <p>
                <b>Бренд</b>: {brand}.
              </p>
            )}

            <Markdown>{item.dp_markdown}</Markdown>

            <details>
              <summary style={{ color: 'lightgray' }}>Другие данные</summary>
              <p>
                <b>ID</b>: {item.dp_id}
              </p>
              <p>
                <b>Сегмент ссылки</b>: &quot;{item.dp_seoUrlSegment}&quot;
              </p>
              <p>
                <b>Заголовок</b>: {item.dp_seoTitle}
              </p>
              <p>
                <b>Описание:</b>
              </p>
              {item.dp_seoDescription.split('\n').map(p => {
                return <p key={p}>{p}</p>;
              })}
              <p>
                <b>Ключевые слова:</b>
              </p>
              {item.dp_seoUrlSegment.split('\n').map(p => {
                return <p key={p}>{p}</p>;
              })}
            </details>
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

export async function getStaticProps(context: IServerSideProps) {
  const { urlSegment } = context.params;

  try {
    const item = await FetchItems.filterOneByModel(urlSegment);
    const items = await FetchItems.getFolders(item.dp_id);

    if (item.dp_isHidden) {
      return {
        notFound: true, // Установите флаг notFound на true, чтобы вернуть 404
      };
    }

    const props: IProps = { item, items };
    return {
      props,
      revalidate: 60, // Перегенерация страницы каждые 60 секунд
    };
  } catch (exception) {
    if (exception instanceof HttpException && exception.HTTP_STATUS === 404) {
      return {
        notFound: true, // Установите флаг notFound на true, чтобы вернуть 404
      };
    }

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
  const nomenclature = (
    await FetchItems.getPagination({
      limit: 10000,
      page: 1,
    })
  ).data.filter(obj => !obj.dp_isHidden);

  let paths: IServerSideProps[] = nomenclature.map(e => {
    return {
      params: {
        urlSegment: e.dp_seoUrlSegment,
      },
    };
  });

  return {
    paths,
    fallback: 'blocking', // Используйте обработку ошибок 404 и ISR
  };
}
