import Link from 'next/link';

import AppTitle from '@/components/AppTitle/AppTitle';
import AppWrapper from '@/components/AppWrapper/AppWrapper';
import Breadcrumbs from '@/components/Breadcrumbs/Breadcrumbs';
import AppContainer from '@/components/AppContainer/AppContainer';
import AppDescription from '@/components/AppDescription/AppDescription';

export default function Error404Page() {
  return (
    <AppWrapper>
      <Breadcrumbs />
      <AppContainer>
        <AppTitle title="404" />
        <AppDescription description="404" />
        <h1>404 - Страница не найдена</h1>
        <p style={{ textAlign: 'center' }}>
          К сожалению, запрашиваемая Вами страница не найдена. Возможно, Вы
          ввели неправильный адрес или страница была удалена.
        </p>
        <p style={{ textAlign: 'center' }}>
          Предлагаем вернуться на <Link href="/">домашнюю страницу</Link> и
          продолжить просмотр нашего сайта.
        </p>
      </AppContainer>
    </AppWrapper>
  );
}
