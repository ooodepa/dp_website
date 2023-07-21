import { useRouter } from 'next/router';
import { FormEvent, useState } from 'react';

import AppHead from '../AppHead/AppHead';
import AppTitle from '../AppTitle/AppTitle';
import styles from './ChangePassword.module.css';
import AppWrapper from '../AppWrapper/AppWrapper';
import AppKeywords from '../AppKeywords/AppKeywords';
import Breadcrumbs from '../Breadcrumbs/Breadcrumbs';
import AppModal from '@/components/AppModal/AppModal';
import AppContainer from '../AppContainer/AppContainer';
import FetchUsers from '@/utils/FetchBackend/rest/api/users';
import AppDescription from '../AppDescription/AppDescription';
import AlertExceptionHelper, {
  AsyncAlertExceptionHelper,
} from '@/utils/AlertExceptionHelper';
import ChangePasswordDto from '@/utils/FetchBackend/rest/api/users/dto/change-password.dto';

export default function ChangePassword() {
  const route = useRouter();
  const [modal, setModal] = useState<JSX.Element>(<></>);
  const [data, setDate] = useState<ChangePasswordDto>({
    dp_oldPassword: '',
    dp_newPassword: '',
  });

  function handleChangeOldPassword(password: string) {
    setDate({ ...data, dp_oldPassword: password });
  }

  function handleChangeNewPassword(password: string) {
    setDate({ ...data, dp_newPassword: password });
  }

  async function handleFormSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (data.dp_oldPassword.length === 0) {
      setModal(
        <AppModal title="Смена пароля" message="Вы не указали старый пароль">
          <button onClick={() => setModal(<></>)}>Закрыть</button>
        </AppModal>,
      );
      return;
    }

    if (data.dp_newPassword.length === 0) {
      setModal(
        <AppModal title="Смена пароля" message="Вы не указали новый пароль">
          <button onClick={() => setModal(<></>)}>Закрыть</button>
        </AppModal>,
      );
      return;
    }

    try {
      const isChangedPassword = await FetchUsers.changePassword(setModal, data);

      if (isChangedPassword) {
        route.back();
      }
    } catch (exception) {
      await AsyncAlertExceptionHelper(exception);
    }
  }

  const SEO_TITLE = 'Смена пароля';
  const SEO_DESCRIPTION = 'Смена пароля';
  const SEO_KEYWORDS = 'Смена пароля';

  return (
    <AppWrapper>
      <AppTitle title={SEO_TITLE} />
      <AppDescription description={SEO_DESCRIPTION} />
      <AppKeywords keywords={SEO_KEYWORDS} />
      <AppHead />
      <Breadcrumbs />
      <AppContainer>
        <h2>Смена пароля</h2>
        <div className={styles.wrapper}>
          {modal}
          <form action="" onSubmit={handleFormSubmit}>
            <input
              type="password"
              placeholder="Старый пароль"
              value={data.dp_oldPassword}
              onChange={event => handleChangeOldPassword(event.target.value)}
            />
            <input
              type="password"
              placeholder="Новый пароль"
              value={data.dp_newPassword}
              onChange={event => handleChangeNewPassword(event.target.value)}
            />
            <button>Сменить пароль</button>
          </form>
        </div>
      </AppContainer>
    </AppWrapper>
  );
}
