import AppTitle from '@/components/AppTitle/AppTitle';
import AppWrapper from '@/components/AppWrapper/AppWrapper';
import AppKeywords from '@/components/AppKeywords/AppKeywords';
import AppDescription from '@/components/AppDescription/AppDescription';
import OzonSellerProductsPage from '@/components/OzonSellerProducts/OzonSellerProducts';

export default function OzonPage() {
  return (
    <AppWrapper>
      <AppTitle title={'Продукция OZON'} />
      <AppDescription description={'Продукция OZON. ООО "ДЕ-ПА" на OZON'} />
      <AppKeywords keywords={'ООО "ДЕ-ПА" на OZON'} />
      <OzonSellerProductsPage />;
    </AppWrapper>
  );
}
