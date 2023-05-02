import {
  faSkype,
  faWhatsapp,
  faViber,
  faTelegram,
} from '@fortawesome/free-brands-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import styles from './ContactPosts.module.css';
import HelperDto from '@/dto/helpers/HelperDto';
import ContactTypeDto from '@/dto/contact-types/ContactTypeDto';
import AppContainer from '@/components/AppContainer/AppContainer';

interface IProps {
  helpers: HelperDto[];
  contactTypes: ContactTypeDto[];
}

export default function ContactPosts(props: IProps) {
  return (
    <AppContainer>
      <ul className={styles.helpers}>
        {props.helpers.map(element => {
          if (element.dp_isHidden) {
            return null;
          }

          return (
            <li key={element.dp_id}>
              <p className={styles.helper__title}>{element.dp_name}</p>
              <p className={styles.helper__description}>
                {element.dp_description}
              </p>
              <ul className={styles.phonesEmails}>
                {element.dp_helperContactTypes.map(j => {
                  if (j.dp_isHidden) {
                    return null;
                  }

                  let contactType = '';
                  for (let i = 0; i < props.contactTypes.length; ++i) {
                    if (j.dp_contactTypeId === props.contactTypes[i].dp_id) {
                      contactType = props.contactTypes[i].dp_name;
                      break;
                    }
                  }

                  if (contactType === 'phone') {
                    return (
                      <li key={j.dp_id}>
                        <a
                          href={`tel:${j.dp_value.replace(/[^+\d]/g, '')}`}
                          className={styles.contactType}>
                          {j.dp_value}
                        </a>
                      </li>
                    );
                  }

                  if (contactType === 'email') {
                    return (
                      <li key={j.dp_id}>
                        <a
                          href={`mailto:${j.dp_value}`}
                          className={styles.contactType}>
                          {j.dp_value}
                        </a>
                      </li>
                    );
                  }

                  return null;
                })}
              </ul>
              <ul className={styles.socials}>
                {element.dp_helperContactTypes.map(j => {
                  if (j.dp_isHidden) {
                    return null;
                  }

                  let contactType = '';
                  for (let i = 0; i < props.contactTypes.length; ++i) {
                    if (j.dp_contactTypeId === props.contactTypes[i].dp_id) {
                      contactType = props.contactTypes[i].dp_name;
                      break;
                    }
                  }

                  if (contactType === 'skype') {
                    return (
                      <li key={j.dp_id}>
                        <a
                          href={`skype:${j.dp_value}`}
                          className={`${styles.contactType} ${styles.social__skype}`}>
                          <FontAwesomeIcon icon={faSkype} />
                        </a>
                      </li>
                    );
                  }

                  if (contactType === 'whatsapp') {
                    return (
                      <li key={j.dp_id}>
                        <a
                          href={`https://api.whatsapp.com/send?phone=${j.dp_value}`}
                          className={`${styles.contactType} ${styles.social__whatsapp}`}>
                          <FontAwesomeIcon icon={faWhatsapp} />
                        </a>
                      </li>
                    );
                  }

                  if (contactType === 'viber') {
                    return (
                      <li key={j.dp_id}>
                        <a
                          href={`viber://add?number=${j.dp_value}`}
                          className={`${styles.contactType} ${styles.social__viber}`}>
                          <FontAwesomeIcon icon={faViber} />
                        </a>
                      </li>
                    );
                  }

                  if (contactType === 'telegram') {
                    return (
                      <li key={j.dp_id}>
                        <a
                          href={`https://t.me/${j.dp_value}`}
                          className={`${styles.contactType} ${styles.social__viber}`}>
                          <FontAwesomeIcon icon={faTelegram} />
                        </a>
                      </li>
                    );
                  }

                  return null;
                })}
              </ul>
            </li>
          );
        })}
      </ul>
    </AppContainer>
  );
}
