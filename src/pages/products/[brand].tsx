import Link from 'next/link';
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
  // items: GetItemDto[];
}

export default function BrandPage(props: IProps) {
  const route = useRouter();
  const { brand } = route.query;
  const [itemBrandData, setItemBrandData] = useState<GetItemBrandDto>(
    props.itemBrand,
  );
  const [itemCategoryArray, setItemCategoryArray] = useState<
    GetItemCategoryDto[]
  >([]);

  useEffect(() => {
    (async function () {
      try {
        const TEMP_ITEM_BRAND = await FetchItemBrand.filterOneByUrl(`${brand}`);
        setItemBrandData(TEMP_ITEM_BRAND);

        const TEMP_ITEM_CATEGORIES = await FetchItemCategories.filterByBrand(
          `${brand}`,
        );
        setItemCategoryArray(TEMP_ITEM_CATEGORIES);
      } catch (exception) {
        await AsyncAlertExceptionHelper(exception);
        setItemBrandData(props.itemBrand);
        setItemCategoryArray(props.itemCategories);
      }
    })();
  }, [brand, props.itemBrand, props.itemCategories]);

  return (
    <AppWrapper>
      <AppTitle title={itemBrandData.dp_seoTitle} />
      <AppDescription description={itemBrandData.dp_seoDescription} />
      <AppKeywords keywords={itemBrandData.dp_seoKeywords} />
      <AppHead />
      <Breadcrumbs />
      <AppContainer>
        <h1>{itemBrandData.dp_seoTitle}</h1>
      </AppContainer>
      <ItemCategoryPosts brand={`${brand}`} categories={itemCategoryArray} />
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
    // const items = await FetchItems.getByBrand(brand);

    const props: IProps = {
      itemCategories,
      itemBrand,
      // items,
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
      itemCategories: [],
      itemBrand: {
        dp_id: 0,
        dp_isHidden: false,
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
      // items: [],
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
          brand: element.dp_seoUrlSegment,
        },
      });
    }
  });

  return {
    paths,
    fallback: 'blocking', // Используйте обработку ошибок 404 и ISR
  };
}
