import { useRouter } from 'next/router';

import AppTitle from '@/components/AppTitle/AppTitle';
import AppButton from '@/components/AppButton/AppButton';
import AppWrapper from '@/components/AppWrapper/AppWrapper';
import Breadcrumbs from '@/components/Breadcrumbs/Breadcrumbs';
import AppKeywords from '@/components/AppKeywords/AppKeywords';
import AppContainer from '@/components/AppContainer/AppContainer';
import AppDescription from '@/components/AppDescription/AppDescription';

const SEO_TITLE = 'Моя заявка';
const SEO_DESCRIPTION = 'Моя заявка';
const SEO_KEYWORDS = 'Моя заявка';

export default function OrderPage() {
  const route = useRouter();
  const { orderId } = route.query;

  function toCheckPage() {
    route.push(`/user-profile/orders/${orderId}/get-check`);
  }

  return (
    <AppWrapper>
      <AppTitle title={SEO_TITLE} />
      <AppDescription description={SEO_DESCRIPTION} />
      <AppKeywords keywords={SEO_KEYWORDS} />
      <Breadcrumbs />
      <AppContainer>
        <h2>{SEO_TITLE}</h2>
        <div style={{ textAlign: 'center' }}>
          <AppButton onClick={toCheckPage}>
            {'Получить документ "Счёт-фактура"'}
          </AppButton>
        </div>
      </AppContainer>
    </AppWrapper>
  );
}
