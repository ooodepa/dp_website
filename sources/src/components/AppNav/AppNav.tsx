import Link from 'next/link';
import { useState } from 'react';
import { faBars } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import logo from './logo.png';
import Image from 'next/image';
import styles from './AppNav.module.css';

interface IMenuItem {
  title: string;
  url: string;
}

const menu: IMenuItem[] = [
  {
    title: 'Главная',
    url: '/',
  },
  {
    title: 'О нас',
    url: '/about',
  },
  {
    title: 'Продукты',
    url: '/products',
  },
  {
    title: 'Прайсы',
    url: '/prices',
  },
  {
    title: 'Каталоги',
    url: '/catalogs',
  },
  {
    title: 'Сертификаты',
    url: '/certificates',
  },
  {
    title: 'Контакты',
    url: '/contacts',
  },
];

export default function AppNav() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className={styles.nav__wrapper}>
      <div className={styles.nav__container}>
        <header className={styles.nav__wrapper_inner}>
          <div className={styles.nav__menu_no_icon}></div>
          <Link href="/" title="На главную" className={styles.nav__image_block}>
            <Image src={logo} alt="" />
          </Link>
          <div
            className={styles.nav__menu_icon}
            onClick={event => setIsOpen(!isOpen)}>
            <FontAwesomeIcon icon={faBars} />
          </div>
        </header>

        <ul style={{ display: isOpen ? 'block' : 'none' }}>
          {menu.map(element => {
            return (
              <li key={element.url}>
                <Link href={element.url}>{element.title}</Link>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}
