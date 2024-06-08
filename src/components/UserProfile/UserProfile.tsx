import Link from 'next/link';
import { useRouter } from 'next/router';
import { MouseEventHandler, useEffect, useState, useId } from 'react';

import AppTitle from '../AppTitle/AppTitle';
import styles from './UserProfile.module.css';
import AppKeywords from '../AppKeywords/AppKeywords';
import Breadcrumbs from '../Breadcrumbs/Breadcrumbs';
import AppWrapper from '@/components/AppWrapper/AppWrapper';
import FetchUsers from '@/utils/FetchBackend/rest/api/users';
import AppDescription from '../AppDescription/AppDescription';
import HttpException from '@/utils/FetchBackend/HttpException';
import AppContainer from '@/components/AppContainer/AppContainer';
import FetchSessions from '@/utils/FetchBackend/rest/api/sessions';
import { AsyncAlertExceptionHelper } from '@/utils/AlertExceptionHelper';
import GetOneUserDto from '@/utils/FetchBackend/rest/api/users/dto/get-one-user.dto';

interface IMenu {
  id: string;
  text: string;
  href?: string;
  onClick?: MouseEventHandler<HTMLButtonElement> | undefined;
}

export default function UserProfile() {
  const route = useRouter();
  const [isLogin, setIsLogin] = useState(false);
  const [userData, setUserData] = useState<GetOneUserDto>({
    dp_id: -1,
    dp_address: '',
    dp_nameLegalEntity: '',
    dp_shortNameLegalEntity: '',
    dp_unp: '',
    dp_email: '',
  });

  const menu: IMenu[] = [
    {
      id: useId(),
      href: '/user-profile/orders',
      text: 'Мои заказы',
    },
    {
      id: useId(),
      href: '/user-profile/sessions',
      text: 'Устройства',
    },
    {
      id: useId(),
      href: '/user-profile/change-password',
      text: 'Сменить пароль',
    },
    {
      id: useId(),
      href: `${process.env.NEXT_PUBLIC__ANDROID_APP}`,
      text: 'Скачать мобильное приложение',
    },
    {
      id: useId(),
      text: 'Выход из аккаунта',
      onClick: handleLogout,
    },
  ];

  useEffect(() => {
    (async function () {
      try {
        const jUserData = await FetchUsers.getOne();
        setUserData(jUserData);
        setIsLogin(true);
      } catch (exception) {
        if (
          exception instanceof Error &&
          exception.message === 'Войдите в аккаунт'
        ) {
          route.push('/user-profile/sign-in');
          return;
        }

        if (
          exception instanceof HttpException &&
          exception.HTTP_STATUS === 401
        ) {
          route.push('/user-profile/sign-in');
          return;
        }
        await AsyncAlertExceptionHelper(exception);
      }
    })();
  }, [route]);

  async function handleLogout() {
    try {
      const isLogout = await FetchSessions.logout();
      if (isLogout) {
        route.push('/user-profile');
      }
    } catch (exception) {
      await AsyncAlertExceptionHelper(exception);
    }
  }

  const SEO_TITLE = 'Мой аккаунт';
  const SEO_DESCRIPTION = 'Мой аккаунт';
  const SEO_KEYWORDS = '';

  if (!isLogin) {
    return (
      <AppWrapper>
        <AppContainer>
          <div></div>
        </AppContainer>
      </AppWrapper>
    );
  }

  const shortEmail1 = userData.dp_email.slice(0, 2);
  const shortEmail2 = userData.dp_email.slice(userData.dp_email.indexOf('@'));
  const shortEmail = `${shortEmail1}...${shortEmail2}`;

  return (
    <AppWrapper>
      <AppTitle title={SEO_TITLE} />
      <AppDescription description={SEO_DESCRIPTION} />
      <AppKeywords keywords={SEO_KEYWORDS} />
      <Breadcrumbs />
      <AppContainer>
        <h2>{SEO_TITLE}</h2>
        <ul className={styles.ul}>
          <li>{userData.dp_address}</li>
          <li>{userData.dp_nameLegalEntity}</li>
          <li>{userData.dp_shortNameLegalEntity}</li>
          <li>{userData.dp_unp}</li>
          <li>{shortEmail}</li>
        </ul>
        <ul className={styles.buttons}>
          {menu.map(e => {
            return (
              <li key={e.id}>
                {e.href ? (
                  <Link href={e.href}>{e.text}</Link>
                ) : e.onClick ? (
                  <button onClick={e.onClick}>{e.text}</button>
                ) : null}
              </li>
            );
          })}
        </ul>
      </AppContainer>
    </AppWrapper>
  );
}
