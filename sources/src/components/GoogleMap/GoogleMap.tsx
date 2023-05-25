import AppEnv from '@/AppEnv';
import styles from './GoogleMap.module.css';

export default function GoogleMap() {
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
