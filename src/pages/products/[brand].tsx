import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

import AppHead from '@/components/AppHead/AppHead';
import AppTitle from '@/components/AppTitle/AppTitle';
import AppWrapper from '@/components/AppWrapper/AppWrapper';
import Breadcrumbs from '@/components/Breadcrumbs/Breadcrumbs';
import AppKeywords from '@/components/AppKeywords/AppKeywords';
import HttpException from '@/utils/FetchBackend/HttpException';
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

  try {
    const itemBrand = await FetchItemBrand.filterOneByUrl(brand);
    const itemCategories = (
      await FetchItemCategories.filterByBrand(brand)
    ).filter(obj => !obj.dp_isHidden);

    const props: IProps = { itemCategories, itemBrand };
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
      itemCategories: [],
      itemBrand: {
        dp_id: 0,
        dp_isHidden: false,
        dp_name: '',
        dp_photoUrl: '',
        dp_seoDescription: '',
        dp_seoKeywords: '',
        dp_sortingIndex: 0,
        dp_urlSegment: '',
      },
    };
    return {
      props,
      revalidate: 60, // Перегенерация страницы каждые 60 секунд
    };
    // return {
    //   redirect: {
    //     destination: `/products`, // Replace with the destination URL
    //     permanent: false, // Set to true for permanent redirect, false for temporary
    //   },
    // };
  }
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
