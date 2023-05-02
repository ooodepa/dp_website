import { ReactNode } from 'react';

import styles from './AppWrapper.module.css';
import AppNav from '@/components/AppNav/AppNav';
import AppFooter from '@/components/AppFooter/AppFooter';

interface IProps {
  children: ReactNode;
}

export default function AppWrapper(props: IProps) {
  return (
    <div className={styles.app__wrapper}>
      <div className={styles.app__content}>
        <AppNav />
        {props.children}
      </div>
      <div className={styles.app__footer}>
        <AppFooter />
      </div>
    </div>
  );
}
