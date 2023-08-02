import { useEffect, useState } from 'react';

import AppHead from '@/components/AppHead/AppHead';
import AppTitle from '@/components/AppTitle/AppTitle';
import AppWrapper from '@/components/AppWrapper/AppWrapper';
import Breadcrumbs from '@/components/Breadcrumbs/Breadcrumbs';
import FetchItemBrand from '@/utils/FetchBackend/rest/api/item-brands';
import BrandItemPosts from '@/components/BrandItemPosts/BrandItemPosts';
import AppDescription from '@/components/AppDescription/AppDescription';
import { AsyncAlertExceptionHelper } from '@/utils/AlertExceptionHelper';
import GetItemBrandDto from '@/utils/FetchBackend/rest/api/item-brands/dto/get-item-brand.dto';

interface IProps {
  brands: GetItemBrandDto[];
}

export default function BrandsPage(props: IProps) {
  const [arrBrands, setArrBrands] = useState<GetItemBrandDto[]>(props.brands);

  useEffect(() => {
    (async function () {
      try {
        const jBrands = await FetchItemBrand.get();
        setArrBrands(jBrands);
      } catch (exception) {
        await AsyncAlertExceptionHelper(exception);
        setArrBrands(props.brands);
      }
    })();
  }, [props.brands]);

  return (
    <AppWrapper>
      <AppTitle title="Бренды" />
      <AppDescription description="Производители номенклатуры" />
      <AppHead />
      <Breadcrumbs />
      <h1>Бренды</h1>
      <BrandItemPosts brands={arrBrands} />
    </AppWrapper>
  );
}

export async function getStaticProps() {
  const brands = (await FetchItemBrand.get()).filter(obj => !obj.dp_isHidden);

  return {
    props: { brands },
  };
}
