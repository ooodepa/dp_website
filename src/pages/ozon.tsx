import AppTitle from '@/components/AppTitle/AppTitle';
import OzonProductDto from '@/types/api/OzonProduct.dto';
import fetchWithCache from '@/utils/fetch/fetchWithCache';
import AppWrapper from '@/components/AppWrapper/AppWrapper';
import AppKeywords from '@/components/AppKeywords/AppKeywords';
import AppDescription from '@/components/AppDescription/AppDescription';
import OzonSellerProductsPage from '@/components/OzonSellerProducts/OzonSellerProducts';

interface IProps {
  ozonProducts: OzonProductDto[];
}

export default function OzonPage(props: IProps) {
  return (
    <AppWrapper>
      <AppTitle title={'Продукция OZON'} />
      <AppDescription description={'Продукция OZON. ООО "ДЕ-ПА" на OZON'} />
      <AppKeywords keywords={'ООО "ДЕ-ПА" на OZON'} />
      <OzonSellerProductsPage ozonProducts={props.ozonProducts} />
    </AppWrapper>
  );
}

export async function getStaticProps() {
  try {
    const URL_OZON_PRODUCTS =
      'https://de-pa.by/api/v1/ozon-seller/info-products?limit=10000';
    const OZON_PRODUCTS: OzonProductDto[] = (
      await fetchWithCache(URL_OZON_PRODUCTS)
    ).data;

    const SORTED_OZON_PRODUCTS = OZON_PRODUCTS.sort((a, b) =>
      a.offer_id.localeCompare(b.offer_id),
    ).sort((a, b) => b.stocks__present - a.stocks__present);

    const props: IProps = {
      ozonProducts: SORTED_OZON_PRODUCTS,
    };

    return {
      props,
      revalidate: 60, // Перегенерация страницы каждые 60 секунд
    };
  } catch (exception) {
    console.error('< < < < < < < <');
    console.error(exception);
    console.error('> > > > > > > >');
    const props: IProps = {
      ozonProducts: [],
    };
    return {
      props,
      revalidate: 60, // Перегенерация страницы каждые 60 секунд
    };
  }
}
