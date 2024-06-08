import Link from 'next/link';
import { useRouter } from 'next/router';
import { FormEvent, useState } from 'react';

import AppTitle from '../AppTitle/AppTitle';
import styles from './ForgetPassword.module.css';
import AppWrapper from '../AppWrapper/AppWrapper';
import AppKeywords from '../AppKeywords/AppKeywords';
import AppModal from '@/components/AppModal/AppModal';
import AppContainer from '../AppContainer/AppContainer';
import FetchUsers from '@/utils/FetchBackend/rest/api/users';
import AppDescription from '../AppDescription/AppDescription';
import AlertExceptionHelper from '@/utils/AlertExceptionHelper';
import ForgetPasswordDto from '@/utils/FetchBackend/rest/api/users/dto/forget-password.dto';

export default function ForgetPassword() {
  const route = useRouter();
  const [modal, setModal] = useState<JSX.Element>(<></>);
  const [data, setDate] = useState<ForgetPasswordDto>({
    emailOrLogin: '',
  });

  function handleChangeEmail(email: string) {
    setDate({ ...data, emailOrLogin: email });
  }

  async function handleFormSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (data.emailOrLogin.length === 0) {
      setModal(
        <AppModal
          title="Забыли пароль"
          message="Вы не указали логин или e-mail">
          <button onClick={() => setModal(<></>)}>Закрыть</button>
        </AppModal>,
      );
      return;
    }

    try {
      const isSendEmail = await FetchUsers.forgetPassword(setModal, data);

      if (isSendEmail) {
        route.back();
      }
    } catch (exception) {
      await AlertExceptionHelper(exception);
    }
  }

  const SEO_TITLE = 'Забыли пароль';
  const SEO_DESCRIPTION = 'Забыли пароль';
  const SEO_KEYWORDS = 'Забыли пароль';

  return (
    <AppWrapper>
      <AppTitle title={SEO_TITLE} />
      <AppDescription description={SEO_DESCRIPTION} />
      <AppKeywords keywords={SEO_KEYWORDS} />
      <AppContainer>
        <h2>Восстановление пароля</h2>
        <div className={styles.wrapper}>
          {modal}
          <form action="" onSubmit={handleFormSubmit}>
            <input
              type="text"
              placeholder="Логин или e-mail"
              value={data.emailOrLogin}
              onChange={event => handleChangeEmail(event.target.value)}
            />
            <button>Отправить письмо</button>
            <Link href="/user-profile/sign-in">Войти в аккаунт</Link>
            <Link href={`${process.env.NEXT_PUBLIC__ANDROID_APP}`}>
              Скачать моб. приложение
            </Link>
          </form>
        </div>
      </AppContainer>
    </AppWrapper>
  );
}
