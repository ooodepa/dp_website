import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

import Item from '@/components/Item/Item';
import AppHead from '@/components/AppHead/AppHead';
import AppTitle from '@/components/AppTitle/AppTitle';
import AppWrapper from '@/components/AppWrapper/AppWrapper';
import FetchItems from '@/utils/FetchBackend/rest/api/items';
import Breadcrumbs from '@/components/Breadcrumbs/Breadcrumbs';
import AppKeywords from '@/components/AppKeywords/AppKeywords';
import HttpException from '@/utils/FetchBackend/HttpException';
import FetchItemBrand from '@/utils/FetchBackend/rest/api/item-brands';
import AppDescription from '@/components/AppDescription/AppDescription';
import { AsyncAlertExceptionHelper } from '@/utils/AlertExceptionHelper';
import GetItemDto from '@/utils/FetchBackend/rest/api/items/dto/get-item.dto';
import FetchItemCategories from '@/utils/FetchBackend/rest/api/item-categories';
import FetchItemCharacteristics from '@/utils/FetchBackend/rest/api/item-characteristics';
import GetItemBrandDto from '@/utils/FetchBackend/rest/api/item-brands/dto/get-item-brand.dto';
import GetItemCategoryDto from '@/utils/FetchBackend/rest/api/item-categories/dto/get-item-category.dto';
import GetItemCharacteristicDto from '@/utils/FetchBackend/rest/api/item-characteristics/dto/get-item-characteristic.dto';

interface IProps {
  item: GetItemDto;
  itemCharacteristics: GetItemCharacteristicDto[];
  itemBrand: GetItemBrandDto;
  itemCategory: GetItemCategoryDto;
}

export default function ModelPage(props: IProps) {
  const route = useRouter();
  const { brand, category, model } = route.query;
  const [dataItem, setDataItem] = useState<GetItemDto>(props.item);
  const [arrCharacteristics, setArrCharacteristics] = useState<
    GetItemCharacteristicDto[]
  >(props.itemCharacteristics);
  const [dataCategory, setDataCategory] = useState<GetItemCategoryDto>(
    props.itemCategory,
  );
  const [dataBrand, setDataBrand] = useState<GetItemBrandDto>(props.itemBrand);

  useEffect(() => {
    (async function () {
      try {
        const jItem = await FetchItems.filterOneByModel(`${model}`);
        setDataItem(jItem);

        const jCharacteristics = (await FetchItemCharacteristics.get()).sort(
          (a, b) => a.dp_sortingIndex - b.dp_sortingIndex,
        );
        setArrCharacteristics(jCharacteristics);

        const jBrand = await FetchItemBrand.filterOneByUrl(`${brand}`);
        setDataBrand(jBrand);

        const jCategories = await FetchItemCategories.filterOneByUrl(
          `${category}`,
        );
        setDataCategory(jCategories);
      } catch (exception) {
        await AsyncAlertExceptionHelper(exception);
        setDataItem(props.item);
        setArrCharacteristics(props.itemCharacteristics);
        setDataBrand(props.itemBrand);
        setDataCategory(props.itemCategory);
      }
    })();
  }, [
    brand,
    category,
    model,
    props.item,
    props.itemBrand,
    props.itemCategory,
    props.itemCharacteristics,
  ]);

  return (
    <AppWrapper>
      <AppTitle title={dataItem.dp_seoTitle} />
      <AppDescription description={dataItem.dp_seoDescription} />
      <AppKeywords keywords={dataItem.dp_seoKeywords} />
      <AppHead />
      <Breadcrumbs />
      <Item
        item={dataItem}
        itemCharacteristics={arrCharacteristics}
        itemBrand={dataBrand}
        itemCategory={dataCategory}
        brand={`${brand}`}
        category={`${category}`}
      />
    </AppWrapper>
  );
}

const itemCharacteristicsCache: {
  [model: string]: GetItemCharacteristicDto[];
} = {};

const itemBrandCache: {
  [brand: string]: GetItemBrandDto;
} = {};

const itemCategoryCache: {
  [category: string]: GetItemCategoryDto;
} = {};

export async function getStaticProps(context: any) {
  const { brand, category, model } = context.params;
  try {
    const jItem = await FetchItems.filterOneByModel(model);
    if (jItem.dp_isHidden) {
      return {
        notFound: true, // Установите флаг notFound на true, чтобы вернуть 404
      };
    }

    let jCategory: GetItemCategoryDto;
    if (itemCategoryCache[`${category}`]) {
      jCategory = itemCategoryCache[`${category}`];
    } else {
      jCategory = await FetchItemCategories.filterOneByUrl(`${category}`);
      itemCategoryCache[`${category}`] = jCategory;
    }

    if (jCategory.dp_isHidden) {
      return {
        notFound: true, // Установите флаг notFound на true, чтобы вернуть 404
      };
    }

    if (jCategory.dp_seoUrlSegment !== category) {
      return {
        notFound: true, // Установите флаг notFound на true, чтобы вернуть 404
      };
    }

    let jbrand: GetItemBrandDto;
    if (itemBrandCache[`${brand}`]) {
      jbrand = itemBrandCache[`${brand}`];
    } else {
      jbrand = await FetchItemBrand.filterOneByUrl(`${brand}`);
      itemBrandCache[`${brand}`] = jbrand;
    }

    if (jbrand.dp_isHidden) {
      return {
        notFound: true, // Установите флаг notFound на true, чтобы вернуть 404
      };
    }

    if (jbrand.dp_seoUrlSegment !== brand) {
      return {
        notFound: true, // Установите флаг notFound на true, чтобы вернуть 404
      };
    }

    let jCharacteristics: GetItemCharacteristicDto[];
    if (itemCharacteristicsCache['ch']) {
      jCharacteristics = itemCharacteristicsCache['ch'];
    } else {
      jCharacteristics = await FetchItemCharacteristics.get();
      itemCharacteristicsCache['ch'] = jCharacteristics;
    }

    jCharacteristics = jCharacteristics.sort(
      (a, b) => a.dp_sortingIndex - b.dp_sortingIndex,
    );

    const props: IProps = {
      item: jItem,
      itemCharacteristics: jCharacteristics,
      itemBrand: jbrand,
      itemCategory: jCategory,
    };
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
      item: {
        dp_cost: 0,
        dp_id: '',
        dp_1cCode: '',
        dp_1cDescription: '',
        dp_1cIsFolder: false,
        dp_1cParentId: '',
        dp_isHidden: false,
        dp_itemCategoryId: 0,
        dp_itemCharacteristics: [],
        dp_itemGalery: [],
        dp_seoTitle: '',
        dp_seoDescription: '',
        dp_seoKeywords: '',
        dp_seoUrlSegment: '',
        dp_barcodes: '',
        dp_brand: '',
        dp_combinedName: '',
        dp_currancy: '',
        dp_photos: '',
        dp_photos360: '',
        dp_photoUrl: '',
        dp_textCharacteristics: '',
        dp_vendorIds: '',
        dp_sorintIndex: 0,
        dp_youtubeIds: '',
        dp_width: 0,
        dp_height: 0,
        dp_length: 0,
        dp_weight: 0,
        dp_wholesaleQuantity: 0,
      }, // You can set default values or handle null data accordingly
      itemCharacteristics: [],
      itemBrand: {
        dp_id: 0,
        dp_isHidden: true,
        dp_seoTitle: '',
        dp_seoDescription: '',
        dp_seoKeywords: '',
        dp_seoUrlSegment: '',
        dp_photos: '',
        dp_photos360: '',
        dp_photoUrl: '',
        dp_sortingIndex: 0,
        dp_youtubeIds: '',
      },
      itemCategory: {
        dp_id: 0,
        dp_isHidden: true,
        dp_itemBrandId: 0,
        dp_seoTitle: '',
        dp_seoDescription: '',
        dp_seoKeywords: '',
        dp_seoUrlSegment: '',
        dp_photos: '',
        dp_photos360: '',
        dp_photoUrl: '',
        dp_sortingIndex: 0,
        dp_youtubeIds: '',
      },
    };
    return {
      props,
      revalidate: 60, // Перегенерация страницы каждые 60 секунд
    };
    // return {
    //   redirect: {
    //     destination: `/products/${brand}/${category}`, // Replace with the destination URL
    //     permanent: false, // Set to true for permanent redirect, false for temporary
    //   },
    // };
  }
}

interface IServerSideProps {
  params: {
    category: string;
    brand: string;
    model: string;
  };
}

export async function getStaticPaths() {
  const itemBrand = (await FetchItemBrand.get()).filter(
    obj => !obj.dp_isHidden,
  );
  const itemsCategories = (await FetchItemCategories.get()).filter(
    obj => !obj.dp_isHidden,
  );
  const items = await FetchItems.get();

  let paths: IServerSideProps[] = [];

  items.forEach(element => {
    let category = 'undefined';
    let categoryBrandId = 0;
    for (let i = 0; i < itemsCategories.length; ++i) {
      if (element.dp_itemCategoryId == itemsCategories[i].dp_id) {
        category = itemsCategories[i].dp_seoUrlSegment;
        categoryBrandId = itemsCategories[i].dp_itemBrandId;
        break;
      }
    }

    let brand = 'undefined';

    for (let i = 0; i < itemBrand.length; ++i) {
      if (categoryBrandId == itemBrand[i].dp_id) {
        brand = itemBrand[i].dp_seoUrlSegment;
        break;
      }
    }

    if (category !== 'undefined' && brand !== 'undefined') {
      paths.push({
        params: {
          model: element.dp_seoUrlSegment,
          category,
          brand,
        },
      });
    }
  });

  return {
    paths,
    fallback: 'blocking', // Используйте обработку ошибок 404 и ISR
  };
}
