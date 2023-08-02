import { ButtonHTMLAttributes, ReactNode } from 'react';

import styles from './AppButton.module.css';

interface IProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
}

export default function AppButton(props: IProps) {
  return (
    <button className={styles.button} {...props}>
      {props.children}
    </button>
  );
}
