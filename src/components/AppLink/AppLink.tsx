import Link, { LinkProps } from 'next/link';
import { ReactNode } from 'react';

import styles from './AppLink.module.css';

interface IProps extends LinkProps {
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
