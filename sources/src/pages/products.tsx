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
  return (
    <AppWrapper>
      <AppTitle title="Бренды" />
      <AppDescription description="Производители номенклатуры" />
      <AppHead />
      <Breadcrumbs />
      <h1>Бренды</h1>
      <BrandItemPosts brands={props.brands} />
    </AppWrapper>
  );
}

export async function getStaticProps() {
  const brands = (await FetchItemBrand.get()).sort(
    (a, b) => a.dp_sortingIndex - b.dp_sortingIndex,
  );

  return {
    props: { brands },
  };
}
