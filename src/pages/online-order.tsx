import { useEffect } from 'react';

import AppContainer from '@/components/AppContainer/AppContainer';
import AppWrapper from '@/components/AppWrapper/AppWrapper';

export default function OnlineOrderPage() {
  useEffect(() => {
    window.location.replace('/products');
  }, []);

  return (
    <AppWrapper>
      <AppContainer>Redirect to /products</AppContainer>
    </AppWrapper>
  );
}
