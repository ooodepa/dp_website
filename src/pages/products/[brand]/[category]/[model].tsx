import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

import Item from '@/components/Item/Item';
import AppHead from '@/components/AppHead/AppHead';
import AppTitle from '@/components/AppTitle/AppTitle';
import AppWrapper from '@/components/AppWrapper/AppWrapper';
import FetchItems from '@/utils/FetchBackend/rest/api/items';
import Breadcrumbs from '@/components/Breadcrumbs/Breadcrumbs';
import AppKeywords from '@/components/AppKeywords/AppKeywords';
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

        const jCharacteristics = await FetchItemCharacteristics.get();
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
      <AppTitle title={dataItem.dp_name} />
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

    let jCharacteristics: GetItemCharacteristicDto[];
    if (itemCharacteristicsCache['ch']) {
      jCharacteristics = itemCharacteristicsCache['ch'];
    } else {
      jCharacteristics = await FetchItemCharacteristics.get();
      itemCharacteristicsCache['ch'] = jCharacteristics;
    }

    let jbrand: GetItemBrandDto;
    if (itemBrandCache[`${brand}`]) {
      jbrand = itemBrandCache[`${brand}`];
    } else {
      jbrand = await FetchItemBrand.filterOneByUrl(`${brand}`);
      itemBrandCache[`${brand}`] = jbrand;
    }

    let jCategory: GetItemCategoryDto;
    if (itemCategoryCache[`${category}`]) {
      jCategory = itemCategoryCache[`${category}`];
    } else {
      jCategory = await FetchItemCategories.filterOneByUrl(`${category}`);
      itemCategoryCache[`${category}`] = jCategory;
    }

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
    return {
      redirect: {
        destination: `/products/${brand}/${category}`, // Replace with the destination URL
        permanent: false, // Set to true for permanent redirect, false for temporary
      },
    };
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
        category = itemsCategories[i].dp_urlSegment;
        categoryBrandId = itemsCategories[i].dp_itemBrandId;
        break;
      }
    }

    let brand = 'undefined';

    for (let i = 0; i < itemBrand.length; ++i) {
      if (categoryBrandId == itemBrand[i].dp_id) {
        brand = itemBrand[i].dp_urlSegment;
        break;
      }
    }

    if (category !== 'undefined' && brand !== 'undefined') {
      paths.push({
        params: {
          model: element.dp_model,
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
