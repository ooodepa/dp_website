import Link from 'next/link';
import Image from 'next/image';
import {
  faFileContract,
  faFolderOpen,
  faImage,
} from '@fortawesome/free-solid-svg-icons';
import { ReactNode, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import styles from '@/styles/Nomenclature.module.css';
import GetItemDto from '@/utils/FetchBackend/rest/api/items/dto/get-item.dto';

interface IProps {
  items: GetItemDto[];
}

interface IImageWithPlaceholder {
  src: string;
  alt?: string;
  width: number;
  height: number;
  iconHtml?: ReactNode;
  css_width?: string;
  css_height?: string;
  css_maxWidth?: string;
  css_maxHeight?: string;
}

function ImageWithPlaceholder(props: IImageWithPlaceholder) {
  const [loading, setLoading] = useState<boolean>(true);

  const IMAGE = (
    <Image
      src={props.src}
      alt={props.alt || 'x'}
      onLoad={() => {
        setLoading(false);
      }}
      width={props.width}
      height={props.height}
      style={{
        width: loading ? '0px' : props.css_width,
        height: loading ? '0px' : props.css_height,
        maxWidth: props.css_maxWidth,
        maxHeight: props.css_maxHeight,
      }}
    />
  );

  if (props.src == '') {
    return props.iconHtml ? <>{props.iconHtml}</> : <div>x</div>;
  }

  if (loading && props.iconHtml) {
    return (
      <>
        {props.iconHtml}
        {IMAGE}
      </>
    );
  }

  if (loading) {
    return (
      <>
        <div>IMG</div>
        {IMAGE}
      </>
    );
  }

  return IMAGE;
}

export default function Nomenclatures(props: IProps) {
  return (
    <ul className={styles.items__ul}>
      {props.items
        .filter(e => !e.dp_isHidden)
        .map(e => {
          const photos = e.dp_photos.split('\n');
          const mainPhoto = photos[0] || '';
          const ozonIds = e.dp_ozonIds.split('\n').filter(e => e.length > 0);

          return (
            <li key={e.dp_id} className={styles.items__li}>
              <div className={styles.items__mini_icons}>
                {ozonIds.length > 0 ? (
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
                    css_maxHeight='220px'
                    css_maxWidth='220px'
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
