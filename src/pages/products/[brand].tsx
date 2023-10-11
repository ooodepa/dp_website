import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

import AppHead from '@/components/AppHead/AppHead';
import AppTitle from '@/components/AppTitle/AppTitle';
import AppWrapper from '@/components/AppWrapper/AppWrapper';
import Breadcrumbs from '@/components/Breadcrumbs/Breadcrumbs';
import AppKeywords from '@/components/AppKeywords/AppKeywords';
import AppContainer from '@/components/AppContainer/AppContainer';
import FetchItemBrand from '@/utils/FetchBackend/rest/api/item-brands';
import AppDescription from '@/components/AppDescription/AppDescription';
import { AsyncAlertExceptionHelper } from '@/utils/AlertExceptionHelper';
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
  const [dataBrand, setDataBrand] = useState<GetItemBrandDto>(props.itemBrand);
  const [arrCategories, setArrCategories] = useState<GetItemCategoryDto[]>(
    props.itemCategories,
  );

  useEffect(() => {
    (async function () {
      try {
        const jBrand = await FetchItemBrand.filterOneByUrl(`${brand}`);
        setDataBrand(jBrand);
        const jCategories = await FetchItemCategories.filterByBrand(`${brand}`);
        setArrCategories(jCategories);
      } catch (exception) {
        await AsyncAlertExceptionHelper(exception);
        setDataBrand(props.itemBrand);
        setArrCategories(props.itemCategories);
      }
    })();
  }, [brand, props.itemBrand, props.itemCategories]);

  return (
    <AppWrapper>
      <AppTitle title={dataBrand.dp_name} />
      <AppDescription description={dataBrand.dp_seoDescription} />
      <AppKeywords keywords={dataBrand.dp_seoKeywords} />
      <AppHead />
      <Breadcrumbs />
      <AppContainer>
        <h1>{dataBrand.dp_name}</h1>
      </AppContainer>
      <ItemCategoryPosts brand={`${brand}`} categories={arrCategories} />
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

  const itemCategories = (
    await FetchItemCategories.filterByBrand(brand)
  ).filter(obj => !obj.dp_isHidden);
  const itemBrand = await FetchItemBrand.filterOneByUrl(brand);

  const props: IProps = { itemCategories, itemBrand };
  return {
    props,
    revalidate: 60, // Перегенерация страницы каждые 60 секунд
  };
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
    fallback: 'blocking', // Используйте обработку ошибок 404 и ISR
  };
}
