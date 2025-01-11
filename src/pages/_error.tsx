import { NextPageContext } from 'next';

import AppWrapper from '@/components/AppWrapper/AppWrapper';
import AppContainer from '@/components/AppContainer/AppContainer';

interface ErrorPageProps {
  statusCode?: number;
  errorMessage?: string;
}

function ErrorPage({ statusCode, errorMessage }: ErrorPageProps) {
  return (
    <AppWrapper>
      <AppContainer>
        <h2>Ошибка</h2>
        <p>
          {statusCode
            ? `Произошла ошибка на сервере: Код ${statusCode}`
            : 'Произошла ошибка на клиенте.'}
        </p>
        {errorMessage && <p>{errorMessage}</p>}
      </AppContainer>
    </AppWrapper>
  );
}

ErrorPage.getInitialProps = ({ res, err }: NextPageContext) => {
  const statusCode = res?.statusCode || err?.statusCode || 404;
  const errorMessage = err?.message || '';

  return { statusCode, errorMessage };
};

export default ErrorPage;
