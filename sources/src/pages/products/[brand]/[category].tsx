import { useRouter } from 'next/router';

import AppHead from '@/components/AppHead/AppHead';
import AppTitle from '@/components/AppTitle/AppTitle';
import AppWrapper from '@/components/AppWrapper/AppWrapper';
import FetchItems from '@/utils/FetchBackend/rest/api/items';
import AppKeywords from '@/components/AppKeywords/AppKeywords';
import Breadcrumbs from '@/components/Breadcrumbs/Breadcrumbs';
import ItemPosts from '@/components/ItemPosts/ItemCategoryPosts';
import FetchItemBrand from '@/utils/FetchBackend/rest/api/item-brands';
import AppDescription from '@/components/AppDescription/AppDescription';
import GetItemDto from '@/utils/FetchBackend/rest/api/items/dto/get-item.dto';
import FetchItemCategories from '@/utils/FetchBackend/rest/api/item-categories';
import GetItemCategoryDto from '@/utils/FetchBackend/rest/api/item-categories/dto/get-item-category.dto';

interface IProps {
  items: GetItemDto[];
  itemCategory: GetItemCategoryDto;
}

export default function BrandPage(props: IProps) {
  const route = useRouter();
  const { brand, category } = route.query;

  return (
    <AppWrapper>
      <AppTitle title={props.itemCategory.dp_name} />
      <AppDescription description={props.itemCategory.dp_seoDescription} />
      <AppKeywords keywords={props.itemCategory.dp_seoKeywords} />
      <AppHead />
      <Breadcrumbs />
      <h1>{props.itemCategory.dp_name}</h1>
      <ItemPosts
        brand={`${brand}`}
        category={`${category}`}
        items={props.items}
      />
    </AppWrapper>
  );
}

interface IServerSideProps {
  params: {
    category: string;
    brand: string;
  };
}

export async function getStaticProps(context: IServerSideProps) {
  const { category } = context.params;

  const items = (await FetchItems.filterByCategory(category)).filter(
    obj => obj.dp_isHidden === '0',
  );
  const itemCategory = await FetchItemCategories.filterOneByUrl(category);

  const props: IProps = { items, itemCategory };
  return {
    props,
    revalidate: 60, // Перегенерация страницы каждые 60 секунд
  };
}

export async function getStaticPaths() {
  const itemsCategories = (await FetchItemCategories.get()).filter(
    obj => !obj.dp_isHidden,
  );
  const itemBrand = (await FetchItemBrand.get()).filter(
    obj => !obj.dp_isHidden,
  );

  let paths: IServerSideProps[] = [];

  itemsCategories.forEach(element => {
    let brand = 'undefined';
    for (let i = 0; i < itemBrand.length; ++i) {
      if (itemBrand[i].dp_id === element.dp_itemBrandId) {
        brand = itemBrand[i].dp_urlSegment;
        break;
      }
    }

    if (brand !== 'undefined') {
      paths.push({
        params: {
          category: element.dp_urlSegment,
          brand: brand,
        },
      });
    }
  });

  return {
    paths,
    fallback: 'blocking', // Используйте обработку ошибок 404 и ISR
  };
}
