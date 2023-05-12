import { ChangeEvent, SyntheticEvent, useState } from 'react';

import AppModal from '@/components/AppModal/AppModal';
import styles from '@/styles/ManagerLoginPage.module.css';
import FetchSessions from '@/utils/FetchBackend/rest/api/sessions';
import { useRouter } from 'next/router';
import HttpException from '@/utils/FetchBackend/HttpException';

export default function ManagerLoginPage() {
  const route = useRouter();
  const [modal, setModal] = useState(<></>);
  const [data, setData] = useState({
    dp_login: '',
    dp_password: '',
  });

  function handleOnChange(e: ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setData(prev => ({ ...prev, [name]: value }));
  }

  function handleOnSubmit(event: SyntheticEvent) {
    event.preventDefault();

    if (!data.dp_login.length) {
      setModal(
        <AppModal title="Вход" message="Логин не указан">
          <button onClick={() => setModal(<></>)}>Исправить</button>
        </AppModal>,
      );
      return;
    }

    if (!data.dp_password.length) {
      setModal(
        <AppModal title="Вход" message="Пароль не указан">
          <button onClick={() => setModal(<></>)}>Исправить</button>
        </AppModal>,
      );
      return;
    }

    (async function () {
      try {
        const isLogin = await FetchSessions.create(
          setModal,
          data.dp_login,
          data.dp_password,
        );

        if (!isLogin) {
          return;
        }

        route.push('/manager');
      } catch (exception) {
        if (exception instanceof HttpException) {
          setModal(
            <AppModal
              title="Запрос на сервер"
              message={
                `Method: ${exception.HTTP_METHOD} \n` +
                `Status: ${exception.HTTP_STATUS} \n` +
                `URL: ${exception.HTTP_URL}\n`
              }>
              <button onClick={() => setModal(<></>)}>Закрыть</button>
            </AppModal>,
          );
          return;
        }
        alert(exception);
      }
    })();
  }

  return (
    <div className={styles.wrapper}>
      {modal}
      <form className={styles.form} onSubmit={handleOnSubmit}>
        <input
          name="dp_login"
          className={styles.form__input}
          type="text"
          placeholder="Логин или email"
          onChange={handleOnChange}
        />
        <input
          name="dp_password"
          className={styles.form__input}
          type="password"
          placeholder="Пароль"
          onChange={handleOnChange}
        />
        <button className={styles.form__button}>Войти</button>
      </form>
    </div>
  );
}
