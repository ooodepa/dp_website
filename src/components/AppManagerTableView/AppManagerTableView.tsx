import { ReactNode } from 'react';
import styles from './AppManagerTableView.module.css';
import { useRouter } from 'next/router';

interface IProps {
  children: ReactNode;
  side: ReactNode;
}

export default function AppManagerTableView(props: IProps) {
  const route = useRouter();

  return (
    <div className={styles.wrapper}>
      <div className={styles.table__block}>{props.children}</div>
      <div className={styles.side__block}>
        <button onClick={() => route.push('/manager')}>На главную</button>
        {props.side}
      </div>
    </div>
  );
}
