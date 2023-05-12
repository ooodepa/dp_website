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
import ItemDto from '@/utils/FetchBackend/rest/api/items/dto/item-with-id.dto';
import FetchItemCategories from '@/utils/FetchBackend/rest/api/item-categories';
import ItemCharacteristicsDto from '@/dto/item-characteristics/ItemCharacteristicsDto';
import FetchItemCharacteristics from '@/utils/FetchBackend/rest/api/item-characteristics';

interface IProps {
  item: ItemDto;
  itemCharacteristics: ItemCharacteristicsDto[];
}

export default function ModelPage(props: IProps) {
  const route = useRouter();
  const { brand, category, model } = route.query;

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

export async function getStaticProps(context: any) {
  const { model } = context.params;

  const item = await FetchItems.filterOneByModel(model);
  const itemCharacteristics = await FetchItemCharacteristics.get();

  const props: IProps = { item, itemCharacteristics };
  return { props };
}

interface IServerSideProps {
  params: {
    category: string;
    brand: string;
    model: string;
  };
}

export async function getStaticPaths() {
  const itemBrand = await FetchItemBrand.get();
  const itemsCategories = await FetchItemCategories.get();
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

    paths.push({
      params: {
        model: element.dp_model,
        category,
        brand,
      },
    });
  });

  return {
    paths,
    fallback: false,
  };
}
