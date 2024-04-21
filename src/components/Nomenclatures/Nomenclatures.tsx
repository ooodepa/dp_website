import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faFileContract,
  faFolderOpen,
  faImage,
} from '@fortawesome/free-solid-svg-icons';
import styles from '@/styles/Nomenclature.module.css';
import GetItemDto from '@/utils/FetchBackend/rest/api/items/dto/get-item.dto';

interface IProps {
  items: GetItemDto[];
}

export default function Nomenclatures(props: IProps) {
  return (
    <ul className={styles.items__ul}>
      {props.items
        .filter(e => !e.dp_isHidden)
        .map(e => {
          const photos = e.dp_photos.split('\n');
          const mainPhoto = photos[0] || '';

          return (
            <li key={e.dp_id} className={styles.items__li}>
              <Link
                href={`/nomenclature/${e.dp_seoUrlSegment}`}
                className={styles.items__a}>
                <div
                  className={`${styles.items__icon} ${
                    e.dp_1cIsFolder
                      ? styles['items__icon--isFolder']
                      : styles['items__icon--isFile']
                  }`}>
                  <FontAwesomeIcon
                    icon={e.dp_1cIsFolder ? faFolderOpen : faFileContract}
                  />
                </div>
                <div className={styles.items__img_b}>
                  {mainPhoto.length === 0 ? (
                    <FontAwesomeIcon
                      icon={e.dp_1cIsFolder ? faFolderOpen : faImage}
                    />
                  ) : (
                    <img
                      src={mainPhoto}
                      alt="x"
                      className={styles.items__img}
                    />
                  )}
                </div>
                <div className={styles.items__text}>{e.dp_seoTitle}</div>
              </Link>
            </li>
          );
        })}
    </ul>
  );
}
