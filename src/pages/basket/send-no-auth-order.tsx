import AppWrapper from '@/components/AppWrapper/AppWrapper';
import AppContainer from '@/components/AppContainer/AppContainer';
import SendNoAuthOrder from '@/components/SendNoAuthOrder/SendNoAuthOrder';

export default function SendNoAuthOrderPage() {
  return (
    <AppWrapper>
      <AppContainer>
        <SendNoAuthOrder />
      </AppContainer>
    </AppWrapper>
  );
}
