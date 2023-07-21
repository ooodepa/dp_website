import Link from 'next/link';
import { useRouter } from 'next/router';
import { FormEvent, useState } from 'react';

import styles from './SignIn.module.css';
import AppHead from '../AppHead/AppHead';
import AppTitle from '../AppTitle/AppTitle';
import AppKeywords from '../AppKeywords/AppKeywords';
import AppModal from '@/components/AppModal/AppModal';
import AppWrapper from '@/components/AppWrapper/AppWrapper';
import AppDescription from '../AppDescription/AppDescription';
import AlertExceptionHelper from '@/utils/AlertExceptionHelper';
import AppContainer from '@/components/AppContainer/AppContainer';
import FetchSessions from '@/utils/FetchBackend/rest/api/sessions';
import CreateSessionDto from '@/utils/FetchBackend/rest/api/sessions/dto/create-session.dto';

export default function SignIn() {
  const route = useRouter();
  const [modal, setModal] = useState<JSX.Element>(<></>);
  const [data, setDate] = useState<CreateSessionDto>({
    emailOrLogin: '',
    dp_password: '',
  });

  function handleChangeEmail(email: string) {
    setDate({ ...data, emailOrLogin: email });
  }

  function handleChangePassword(password: string) {
    setDate({ ...data, dp_password: password });
  }

  async function handleFormSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (data.emailOrLogin.length === 0) {
      setModal(
        <AppModal title="Вход" message="Вы не указали логин или e-mail">
          <button onClick={() => setModal(<></>)}>Закрыть</button>
        </AppModal>,
      );
      return;
    }

    if (data.dp_password.length === 0) {
      setModal(
        <AppModal title="Вход" message="Вы не указали пароль">
          <button onClick={() => setModal(<></>)}>Закрыть</button>
        </AppModal>,
      );
      return;
    }

    try {
      const isLogin = await FetchSessions.create(setModal, data);

      if (isLogin) {
        route.push('/user-profile');
        return;
      }
    } catch (exception) {
      await AlertExceptionHelper(exception);
    }
  }

  const SEO_TITLE = 'Войдите в аккаунт';
  const SEO_DESCRIPTION = 'Войдите в аккаунт';
  const SEO_KEYWORDS = 'Войдите в аккаунт';

  return (
    <AppWrapper>
      <AppTitle title={SEO_TITLE} />
      <AppDescription description={SEO_DESCRIPTION} />
      <AppKeywords keywords={SEO_KEYWORDS} />
      <AppHead />
      <AppContainer>
        {modal}
        <h2>{SEO_TITLE}</h2>
        <div className={styles.wrapper}>
          <form action="" onSubmit={handleFormSubmit}>
            <input
              type="text"
              placeholder="Логин или e-mail"
              value={data.emailOrLogin}
              onChange={event => handleChangeEmail(event.target.value)}
            />
            <input
              type="password"
              placeholder="Пароль"
              value={data.dp_password}
              onChange={event => handleChangePassword(event.target.value)}
            />
            <button>Войти</button>
            <Link href="/user-profile/sign-up">У меня нет аккаунта</Link>
            <Link href="/user-profile/forget-password">Забыли пароль?</Link>
            <Link href={`${process.env.NEXT_PUBLIC__ANDROID_APP}`}>
              Скачать моб. приложение
            </Link>
          </form>
        </div>
      </AppContainer>
    </AppWrapper>
  );
}
