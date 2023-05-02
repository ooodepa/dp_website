import AppEnv from '@/AppEnv';
import styles from './AppMap.module.css';

export default function AppMap() {
  return (
    <div className={styles.map}>
      <iframe
        src={`https://www.google.com/maps/embed?pb=${AppEnv.NEXT_PUBLIC__SITE_GOOGLE_MAP_PB}`}
        width="600"
        height="450"
        style={{ border: 0 }}
        loading="lazy"
      />
    </div>
  );
}
