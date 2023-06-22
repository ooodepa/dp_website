import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

import AppHead from '@/components/AppHead/AppHead';
import AppTitle from '@/components/AppTitle/AppTitle';
import AppWrapper from '@/components/AppWrapper/AppWrapper';
import Breadcrumbs from '@/components/Breadcrumbs/Breadcrumbs';
import AppKeywords from '@/components/AppKeywords/AppKeywords';
import FetchItemBrand from '@/utils/FetchBackend/rest/api/item-brands';
import AppDescription from '@/components/AppDescription/AppDescription';
import FetchItemCategories from '@/utils/FetchBackend/rest/api/item-categories';
import ItemCategoryPosts from '@/components/ItemCategoryPosts/ItemCategoryPosts';
import GetItemBrandDto from '@/utils/FetchBackend/rest/api/item-brands/dto/get-item-brand.dto';
import GetItemCategoryDto from '@/utils/FetchBackend/rest/api/item-categories/dto/get-item-category.dto';

interface IProps {
  itemCategories: GetItemCategoryDto[];
  itemBrand: GetItemBrandDto;
}

export default function BrandPage(props: IProps) {
  const route = useRouter();
  const { brand } = route.query;
  // const [arr,setArr] = useState<GetItemCategoryDto[]>(props.itemCategories);

  // useEffect(() => {
  //   (async function() {
  //     const arrCategories = await FetchItemCategories.filterByBrand(`${brand}`);
  //     setArr(arrCategories);
  //   })();
  // }, [brand]);

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

// export async function getServerSideProps(context: any) {
//   try {
//     const { brand } = context.params;

//     const itemCategories = (
//       await FetchItemCategories.filterByBrand(`${brand}`)
//     ).filter(obj => !obj.dp_isHidden);

//     const itemBrand = await FetchItemBrand.filterOneByUrl(`${brand}`);

//     const props: IProps = { itemCategories, itemBrand };
//     return { props };
//   } catch (exception) {
//     return {
//       notFound: true, // Return a 404 status code
//     };
//   }
// }

// export const dynamicParams = true;

// export const revalidate = 10; 

interface IServerSideProps {
  params: {
    brand: string;
  };
}

export async function getStaticProps(context: IServerSideProps) {
  const { brand } = context.params;

  const itemCategories = (
    await FetchItemCategories.filterByBrand(brand)
  ).filter(obj => !obj.dp_isHidden);
  const itemBrand = await FetchItemBrand.filterOneByUrl(brand);

  const props: IProps = { itemCategories, itemBrand };
  return { props };
}

export async function getStaticPaths() {
  const brands = (await FetchItemBrand.get()).filter(obj => !obj.dp_isHidden);

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
