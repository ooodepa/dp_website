import { useRouter } from 'next/router';

import AppHead from '@/components/AppHead/AppHead';
import AppTitle from '@/components/AppTitle/AppTitle';
import ItemBrandDto from '@/dto/item-brand/ItemBrandDto';
import AppWrapper from '@/components/AppWrapper/AppWrapper';
import Breadcrumbs from '@/components/Breadcrumbs/Breadcrumbs';
import AppKeywords from '@/components/AppKeywords/AppKeywords';
import ItemCategoryDto from '@/dto/item-category/ItemCategoryDto';
import FetchItemBrand from '@/utils/FetchBackend/rest/api/item-brands';
import AppDescription from '@/components/AppDescription/AppDescription';
import FetchItemCategories from '@/utils/FetchBackend/rest/api/item-categories';
import ItemCategoryPosts from '@/components/ItemCategoryPosts/ItemCategoryPosts';

interface IProps {
  itemCategories: ItemCategoryDto[];
  itemBrand: ItemBrandDto;
}

export default function BrandPage(props: IProps) {
  const route = useRouter();
  const { brand } = route.query;

  return (
    <AppWrapper>
      <AppTitle title={props.itemBrand.dp_name} />
      <AppDescription description={props.itemBrand.dp_seoDescription} />
      <AppKeywords keywords={props.itemBrand.dp_seoKeywords} />
      <AppHead />
      <Breadcrumbs />
      <h1>{props.itemBrand.dp_name}</h1>
      <ItemCategoryPosts brand={`${brand}`} categories={props.itemCategories} />
    </AppWrapper>
  );
}

interface IServerSideProps {
  params: {
    brand: string;
  };
}

export async function getStaticProps(context: IServerSideProps) {
  const { brand } = context.params;

  const itemCategories = await FetchItemCategories.filterByBrand(brand);
  const itemBrand = await FetchItemBrand.filterOneByUrl(brand);

  const props: IProps = { itemCategories, itemBrand };
  return { props };
}

export async function getStaticPaths() {
  const brands = await FetchItemBrand.get();

  let paths: IServerSideProps[] = [];

  brands.forEach(element => {
    if (!element.dp_isHidden) {
      paths.push({
        params: {
          brand: element.dp_urlSegment,
        },
      });
    }
  });

  return {
    paths,
    fallback: false,
  };
}
