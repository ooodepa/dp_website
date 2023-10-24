import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

import AppHead from '@/components/AppHead/AppHead';
import AppTitle from '@/components/AppTitle/AppTitle';
import AppWrapper from '@/components/AppWrapper/AppWrapper';
import FetchItems from '@/utils/FetchBackend/rest/api/items';
import AppKeywords from '@/components/AppKeywords/AppKeywords';
import Breadcrumbs from '@/components/Breadcrumbs/Breadcrumbs';
import ItemPosts from '@/components/ItemPosts/ItemCategoryPosts';
import AppContainer from '@/components/AppContainer/AppContainer';
import FetchItemBrand from '@/utils/FetchBackend/rest/api/item-brands';
import AppDescription from '@/components/AppDescription/AppDescription';
import { AsyncAlertExceptionHelper } from '@/utils/AlertExceptionHelper';
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
  const [dataCatagory, setDataCategory] = useState<GetItemCategoryDto>(
    props.itemCategory,
  );
  const [arrItems, setArrItems] = useState<GetItemDto[]>(props.items);

  useEffect(() => {
    (async function () {
      try {
        const jCategory = await FetchItemCategories.filterOneByUrl(
          `${category}`,
        );
        setDataCategory(jCategory);

        const jItems = await FetchItems.filterByCategory(`${category}`);
        setArrItems(jItems);
      } catch (exception) {
        await AsyncAlertExceptionHelper(exception);
        setDataCategory(props.itemCategory);
        setArrItems(props.items);
      }
    })();
  }, [category, props.itemCategory, props.items]);

  return (
    <AppWrapper>
      <AppTitle title={dataCatagory.dp_name} />
      <AppDescription description={dataCatagory.dp_seoDescription} />
      <AppKeywords keywords={dataCatagory.dp_seoKeywords} />
      <AppHead />
      <Breadcrumbs />
      <AppContainer>
        <h1>{dataCatagory.dp_name}</h1>
      </AppContainer>
      <ItemPosts
        brand={`${brand}`}
        category={`${category}`}
        items={arrItems}
        itemCategory={props.itemCategory}
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
  const { brand, category } = context.params;

  try {
    const items = (await FetchItems.filterByCategory(category)).filter(
      obj => obj.dp_isHidden === '0',
    );
    const itemCategory = await FetchItemCategories.filterOneByUrl(category);

    const props: IProps = { items, itemCategory };
    return {
      props,
      revalidate: 60, // Перегенерация страницы каждые 60 секунд
    };
  } catch (exception) {
    return {
      redirect: {
        destination: `/products/${brand}`, // Replace with the destination URL
        permanent: false, // Set to true for permanent redirect, false for temporary
      },
    };
  }
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
