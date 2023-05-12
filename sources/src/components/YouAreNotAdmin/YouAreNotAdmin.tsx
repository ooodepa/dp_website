import Link from 'next/link';

import styles from './YouAreNotAdmin.module.css';

export default function YouAreNotAdmin() {
  return (
    <div className={styles.wrapper}>
      <div>
        <p>Вы не авторизованы как администратор.</p>
        <p>
          <Link href={'/manager/login'}>Войти как администратор</Link>
        </p>
      </div>
    </div>
  );
}
