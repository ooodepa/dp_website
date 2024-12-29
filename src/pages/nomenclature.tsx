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
import Nomenclatures from '@/components/Nomenclatures/Nomenclatures';
import AppDescription from '@/components/AppDescription/AppDescription';
import NomenclatureBreadCrumbs from '@/components/NomenclatureBreadCrumbs/NomenclatureBreadCrumbs';

const dp_1cParentId = '0c56bfe0-33f4-42a2-85a5-3b14978cb728';

interface IProps {
  item: NomenclatureDto_withOzonProducts;
  items: NomenclatureDto_withOzonProducts[];
}

interface IServerSideProps {
  params: {};
}

export default function NomenclaturePage(props: IProps) {
  return (
    <AppWrapper>
      <AppTitle title={props.item.dp_seoTitle} />
      <AppDescription description={props.item.dp_seoDescription} />
      <AppKeywords keywords={props.item.dp_seoKeywords} />
      <NomenclatureBreadCrumbs model={'root'} />
      <AppContainer>
        <div className={styles.wrapper}>
          <h1>{props.item.dp_seoTitle}</h1>
          <Nomenclatures items={props.items} />
        </div>
      </AppContainer>
    </AppWrapper>
  );
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
  try {
    const URL_ = 'https://de-pa.by/api/v1/items/pagination?limit=10000';

    // Используем кэшированный запрос
    const NOMENCLATURE_ARRAY: NomenclatureDto[] = (await fetchWithCache(URL_))
      .data;

    let item: NomenclatureDto | null = null;
    for (let i = 0; i < NOMENCLATURE_ARRAY.length; ++i) {
      const ITEM = NOMENCLATURE_ARRAY[i];
      if (ITEM.dp_id == dp_1cParentId) {
        item = ITEM;
        break;
      }
    }

    if (item == null) {
      throw new Error(`NOT FOUND ${dp_1cParentId}`);
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
