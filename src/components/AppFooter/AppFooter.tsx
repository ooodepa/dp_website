import data from '@/data.json';
import styles from './AppFooter.module.css';

export default function AppFooter() {
  return (
    <div className={styles.footer__wrapper}>
      <div className={styles.footer__blocks}>
        <div className={styles.footer__left_b}>
          <p>{data.gos_registration.full_name}</p>
          <p>УНП {data.gos_registration.unp}</p>
          <p>{data.gos_registration.full_address}</p>
          <p>
            Свидетельство о государственной регистрации от{' '}
            {data.gos_registration.date}, выдано {data.gos_registration.organ}
          </p>
          <p>Регистрация в БелГИЭ от {data.belgie.date}</p>
        </div>
        <div className={styles.footer__right_b}>
          <p>Режим работы: {data.work_time}</p>
          {data.contacts.map(e => {
            if (e.type === 'tel') {
              const tel = e.value.replaceAll('-', '');
              return (
                <a
                  key={`${e.type} ${e.value}`}
                  className={styles.footer__a}
                  href={`tel:${tel}`}>
                  {e.value}
                </a>
              );
            }

            if (e.type === 'email') {
              return (
                <a
                  key={`${e.type} ${e.value}`}
                  className={styles.footer__a}
                  href={`mailto:${e.value}`}>
                  {e.value}
                </a>
              );
            }

            return null;
          })}
          <p>{data.copyright}</p>
        </div>
      </div>
    </div>
  );
}
