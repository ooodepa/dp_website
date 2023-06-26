import {
  faSkype,
  faWhatsapp,
  faViber,
  faTelegram,
  faLinkedin,
} from '@fortawesome/free-brands-svg-icons';
import { useEffect, useState } from 'react';
import { faLink } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import styles from './ContactPosts.module.css';
import FetchHelpers from '@/utils/FetchBackend/rest/api/helpers';
import AppContainer from '@/components/AppContainer/AppContainer';
import { AsyncAlertExceptionHelper } from '@/utils/AlertExceptionHelper';
import FetchContactTypes from '@/utils/FetchBackend/rest/api/contact-types';
import GetHelperDto from '@/utils/FetchBackend/rest/api/helpers/dto/get-helper.dto';
import GetContactTypeDto from '@/utils/FetchBackend/rest/api/contact-types/dto/get-contact-type.dto';

interface IProps {
  helpers: GetHelperDto[];
  contactTypes: GetContactTypeDto[];
}

export default function ContactPosts(props: IProps) {
  const [arr, setArr] = useState<GetHelperDto[]>(props.helpers);
  const [arrTypes, setArrTypes] = useState<GetContactTypeDto[]>(
    props.contactTypes,
  );

  useEffect(() => {
    (async function () {
      try {
        const jArrTypes = await FetchContactTypes.get();
        const jArrHelpers = await FetchHelpers.get();

        setArrTypes(jArrTypes);
        setArr(jArrHelpers);
      } catch (exception) {
        await AsyncAlertExceptionHelper(exception);
        setArrTypes(props.contactTypes);
        setArr(props.helpers);
      }
    })();
  }, [props.contactTypes, props.helpers]);

  return (
    <AppContainer>
      <ul className={styles.helpers}>
        {arr.map(element => {
          if (element.dp_isHidden) {
            return null;
          }

          return (
            <li key={element.dp_id}>
              <p className={styles.helper__title}>{element.dp_name}</p>
              <p className={styles.helper__description}>{element.dp_text}</p>
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
                  for (let i = 0; i < arrTypes.length; ++i) {
                    if (j.dp_contactTypeId === arrTypes[i].dp_id) {
                      contactType = arrTypes[i].dp_name;
                      break;
                    }
                  }

                  switch (contactType) {
                    case 'skype':
                      return (
                        <li key={j.dp_id}>
                          <ContactSkype value={j.dp_value} />
                        </li>
                      );
                    case 'whatsapp':
                      return (
                        <li key={j.dp_id}>
                          <ContactWhatsapp value={j.dp_value} />
                        </li>
                      );
                    case 'viber':
                      return (
                        <li key={j.dp_id}>
                          <ContactViber value={j.dp_value} />
                        </li>
                      );
                    case 'telegram':
                      return (
                        <li key={j.dp_id}>
                          <ContactTelegram value={j.dp_value} />
                        </li>
                      );
                    case 'linkedin':
                      return (
                        <li key={j.dp_id}>
                          <ContactLinedIn value={j.dp_value} />
                        </li>
                      );
                    case 'link':
                      return (
                        <li key={j.dp_id}>
                          <ContactLink value={j.dp_value} />
                        </li>
                      );
                    default:
                      return null;
                  }
                })}
              </ul>
            </li>
          );
        })}
      </ul>
    </AppContainer>
  );
}

interface IContactProps {
  value: string;
}

function ContactSkype(props: IContactProps) {
  return (
    <a
      href={`skype:${props.value}`}
      className={`${styles.contactType} ${styles.social__skype}`}>
      <FontAwesomeIcon icon={faSkype} />
    </a>
  );
}

function ContactWhatsapp(props: IContactProps) {
  return (
    <a
      href={`https://api.whatsapp.com/send?phone=${props.value}`}
      className={`${styles.contactType} ${styles.social__whatsapp}`}>
      <FontAwesomeIcon icon={faWhatsapp} />
    </a>
  );
}

function ContactViber(props: IContactProps) {
  return (
    <a
      href={`viber://add?number=${props.value}`}
      className={`${styles.contactType} ${styles.social__viber}`}>
      <FontAwesomeIcon icon={faViber} />
    </a>
  );
}

function ContactTelegram(props: IContactProps) {
  return (
    <a
      href={`https://t.me/${props.value}`}
      className={`${styles.contactType} ${styles.social__telegram}`}>
      <FontAwesomeIcon icon={faTelegram} />
    </a>
  );
}

function ContactLinedIn(props: IContactProps) {
  return (
    <a
      href={`https://www.linkedin.com/in/${props.value}`}
      className={`${styles.contactType} ${styles.social__linkedin}`}>
      <FontAwesomeIcon icon={faLinkedin} />
    </a>
  );
}

function ContactLink(props: IContactProps) {
  return (
    <a href={props.value} className={styles.contactType}>
      <FontAwesomeIcon icon={faLink} />
    </a>
  );
}
