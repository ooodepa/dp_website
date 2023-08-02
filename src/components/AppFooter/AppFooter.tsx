import AppEnv from '@/AppEnv';
import styles from './AppFooter.module.css';

export default function AppFooter() {
  return (
    <div className={styles.footer__wrapper}>
      <div className={styles.footer__inner}>
        <p>{AppEnv.NEXT_PUBLIC__SITE_TITLE}</p>
        <p>{AppEnv.NEXT_PUBLIC__SITE_DATE}</p>
      </div>
    </div>
  );
}
