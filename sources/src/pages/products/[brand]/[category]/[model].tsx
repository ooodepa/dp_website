import { useRouter } from 'next/router';

import Item from '@/components/Item/Item';
import AppHead from '@/components/AppHead/AppHead';
import AppTitle from '@/components/AppTitle/AppTitle';
import AppWrapper from '@/components/AppWrapper/AppWrapper';
import FetchItems from '@/utils/FetchBackend/rest/api/items';
import Breadcrumbs from '@/components/Breadcrumbs/Breadcrumbs';
import AppKeywords from '@/components/AppKeywords/AppKeywords';
import FetchItemBrand from '@/utils/FetchBackend/rest/api/item-brands';
import AppDescription from '@/components/AppDescription/AppDescription';
import GetItemDto from '@/utils/FetchBackend/rest/api/items/dto/get-item.dto';
import FetchItemCategories from '@/utils/FetchBackend/rest/api/item-categories';
import FetchItemCharacteristics from '@/utils/FetchBackend/rest/api/item-characteristics';
import GetItemCharacteristicDto from '@/utils/FetchBackend/rest/api/item-characteristics/dto/get-item-characteristic.dto';

interface IProps {
  item: GetItemDto;
  itemCharacteristics: GetItemCharacteristicDto[];
}

export default function ModelPage(props: IProps) {
  const route = useRouter();
  const { brand, category } = route.query;

  return (
    <AppWrapper>
      <AppTitle title={props.item.dp_name} />
      <AppDescription description={props.item.dp_seoDescription} />
      <AppKeywords keywords={props.item.dp_seoKeywords} />
      <AppHead />
      <Breadcrumbs />
      <Item
        item={props.item}
        itemCharacteristics={props.itemCharacteristics}
        brand={`${brand}`}
        category={`${category}`}
      />
    </AppWrapper>
  );
}

const itemCharacteristicsCache: {
  [model: string]: GetItemCharacteristicDto[];
} = {};

export async function getStaticProps(context: any) {
  const { model } = context.params;

  const item = await FetchItems.filterOneByModel(model);
  let itemCharacteristics: GetItemCharacteristicDto[];

  if (itemCharacteristicsCache[model]) {
    itemCharacteristics = itemCharacteristicsCache[model];
  } else {
    itemCharacteristics = await FetchItemCharacteristics.get();
    itemCharacteristicsCache[model] = itemCharacteristics;
  }

  const props: IProps = { item, itemCharacteristics };
  return {
    props,
    revalidate: 60, // Перегенерация страницы каждые 60 секунд
  };
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
