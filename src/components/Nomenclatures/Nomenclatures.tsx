import Link from 'next/link';
import {
  faFileContract,
  faFolderOpen,
  faImage,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import styles from '@/styles/Nomenclature.module.css';
import { NomenclatureDto_withOzonProducts } from '@/types/api/Nomenclature.dto';
import ImageWithPlaceholder from '@/components/ImageWithPlaceholder/ImageWithPlaceholder';

interface IProps {
  items: NomenclatureDto_withOzonProducts[];
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
              <div className={styles.items__mini_icons}>
                {e.ozonProducts.length > 0 ? (
                  <span
                    className={`${styles.items__mini_icon} ${styles['items__mini_icon--ozon']}`}>
                    OZON
                  </span>
                ) : null}
              </div>
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
                  <ImageWithPlaceholder
                    src={mainPhoto}
                    alt="x"
                    width={100}
                    height={100}
                    css_height="auto"
                    css_width="auto"
                    css_maxHeight="220px"
                    css_maxWidth="220px"
                    iconHtml={
                      <FontAwesomeIcon
                        icon={e.dp_1cIsFolder ? faFolderOpen : faImage}
                      />
                    }
                  />
                </div>
                <div className={styles.items__img_circles}>
                  {photos.length > 1
                    ? photos.map(e => {
                        return (
                          <span key={e} className={styles.items__img_circle} />
                        );
                      })
                    : null}
                </div>
                <div className={styles.items__text}>{e.dp_seoTitle}</div>
              </Link>
            </li>
          );
        })}
    </ul>
  );
}
