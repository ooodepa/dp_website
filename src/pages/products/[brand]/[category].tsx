import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

import AppHead from '@/components/AppHead/AppHead';
import AppTitle from '@/components/AppTitle/AppTitle';
import AppWrapper from '@/components/AppWrapper/AppWrapper';
import FetchItems from '@/utils/FetchBackend/rest/api/items';
import AppKeywords from '@/components/AppKeywords/AppKeywords';
import Breadcrumbs from '@/components/Breadcrumbs/Breadcrumbs';
import HttpException from '@/utils/FetchBackend/HttpException';
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

        const jItems = (
          await FetchItems.filterByCategory(`${category}`)
        ).filter(obj => !obj.dp_isHidden);
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
        <p style={{ textAlign: 'center' }}>
          На странице показана номенклатура категории{' '}
          {`«${dataCatagory.dp_name}»`}. Вы можете выбрать номенклатуру ниже - и
          вы увидете галерею картинок, характеристики товара. Желаемую
          номенклатуру добавляйте в корзину. Вы можете отправить нам заявку
          (корзину) желаемой номенклатуры - это не обязывает вас платить. Мы с
          вами свяжемся и обсудим ваш выбор и способ доставки в вашу страну.
        </p>
        <p style={{ textAlign: 'center' }}>
          Также, если вы зайдете с компьютера (большого экрана), то вы можете
          указать желаемое количество номенклатуры в данной таблице{' '}
          <Link
            href={`/online-order/${brand}`}>{`"Номенклатура бренда ${brand}"`}</Link>{' '}
          (тут есть, цена в разных валютах, наименование на разных языках,
          количество в оптовой коробке, объем оптовой коробки, вес оптовой
          коробки).
        </p>
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
    const itemCategory = await FetchItemCategories.filterOneByUrl(category);

    if (itemCategory.dp_isHidden) {
      return {
        notFound: true, // Установите флаг notFound на true, чтобы вернуть 404
      };
    }

    const itemBrand = await FetchItemBrand.getById(itemCategory.dp_itemBrandId);

    if (itemBrand.dp_isHidden) {
      return {
        notFound: true, // Установите флаг notFound на true, чтобы вернуть 404
      };
    }

    if (itemBrand.dp_urlSegment !== brand) {
      return {
        notFound: true, // Установите флаг notFound на true, чтобы вернуть 404
      };
    }

    const items = (await FetchItems.filterByCategory(category)).filter(
      obj => !obj.dp_isHidden,
    );

    const props: IProps = { items, itemCategory };
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
      items: [],
      itemCategory: {
        dp_id: 0,
        dp_isHidden: false,
        dp_itemBrandId: 0,
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
    //     destination: `/products/${brand}`, // Replace with the destination URL
    //     permanent: false, // Set to true for permanent redirect, false for temporary
    //   },
    // };
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
