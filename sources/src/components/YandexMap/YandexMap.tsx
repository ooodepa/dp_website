import styles from './YandexMap.module.css';

export default function YandexMap() {
  return (
    <div className={styles.wrapper}>
      <div style={{ position: 'relative', overflow: 'hidden' }}>
        <iframe
          src={process.env.NEXT_PUBLIC__SITE_YANDEX_MAP}
          width="560"
          height="400"
          style={{ position: 'relative' }}></iframe>
      </div>
    </div>
  );
}
