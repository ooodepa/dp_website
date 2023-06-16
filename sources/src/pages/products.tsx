import { useEffect, useState } from 'react';

import AppHead from '@/components/AppHead/AppHead';
import AppTitle from '@/components/AppTitle/AppTitle';
import AppWrapper from '@/components/AppWrapper/AppWrapper';
import Breadcrumbs from '@/components/Breadcrumbs/Breadcrumbs';
import BrandItemPosts from '@/components/BrandItemPosts/BrandItemPosts';
import AppDescription from '@/components/AppDescription/AppDescription';
import FetchItemBrand from '@/utils/FetchBackend/rest/api/item-brands';
import GetItemBrandDto from '@/utils/FetchBackend/rest/api/item-brands/dto/get-item-brand.dto';

interface IProps {
  brands: GetItemBrandDto[];
}

export default function BrandsPage(props: IProps) {
  const [arr, setArr] = useState<GetItemBrandDto[]>(props.brands);

  useEffect(() => {
    (async function() {
      const arrayBrands = await FetchItemBrand.get();
      setArr(arrayBrands);
    })();
  }, []);

  return (
    <AppWrapper>
      <AppTitle title="Бренды" />
      <AppDescription description="Производители номенклатуры" />
      <AppHead />
      <Breadcrumbs />
      <h1>Бренды</h1>
      <BrandItemPosts brands={arr} />
    </AppWrapper>
  );
}

export async function getStaticProps() {
  const brands = (await FetchItemBrand.get()).filter(obj => !obj.dp_isHidden);

  return {
    props: { brands },
  };
}
