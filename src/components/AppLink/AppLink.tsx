import Link from 'next/link';
import { ReactNode } from 'react';

import styles from './AppLink.module.css';

interface IProps {
  href: string;
  children: ReactNode;
}

export default function AppLink(props: IProps) {
  return (
    <Link className={styles.button} {...props}>
      {props.children}
    </Link>
  );
}
