import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

import styles from '@/styles/ManagerPage.module.css';
import FetchUsers from '@/utils/FetchBackend/rest/api/users';

interface IMenu {
  title: string;
  uri: string;
}

const menu: IMenu[] = [
  {
    title: 'Номенклатура',
    uri: 'items',
  },
  {
    title: 'Бренды',
    uri: 'item-brands',
  },
];

export default function ManagerPage() {
  const route = useRouter();
  const [isAdmin, setIsAdmin] = useState(true);

  useEffect(() => {
    (async function () {
      try {
        const isAdmin = await FetchUsers.isAdmin();
  
        if (!isAdmin) {
          setIsAdmin(false);
          route.push('/manager/login');
        }
  
        setIsAdmin(true);
      } catch(exception) {
        setIsAdmin(false);
        route.push('/manager/login');
      }
    })();
  }, [route]);

  if (!isAdmin) {
    return <div>Вы не администратор</div>
  }

  return (
    <nav className={styles.wrapper}>
      <ul>
        {menu.map((e, index) => {
          return (
            <li key={index}>
              <Link href={`manager/${e.uri}`}>{e.title}</Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
