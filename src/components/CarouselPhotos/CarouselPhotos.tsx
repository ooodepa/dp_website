import Image from 'next/image';
import { ReactNode, useState } from 'react';
import {
  faArrowLeft,
  faArrowRight,
  faImage,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import styles from './CarouselPhotos.module.css';

interface IProps {
  photos: string[];
}

interface ISelectedPhotoData {
  index: number;
  src: string;
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

export default function CarouselPhotos(props: IProps) {
  const [selectedPhotoData, setSelectedPhotoData] =
    useState<ISelectedPhotoData>({
      index: 0,
      src: props.photos[0] || '',
    });

  function left() {
    const LENGTH = props.photos.length;
    if (LENGTH == 0) {
      return;
    }

    const INDEX = selectedPhotoData.index - 1;
    if (INDEX >= 0) {
      setSelectedPhotoData({
        index: INDEX,
        src: props.photos[INDEX],
      });
      return;
    }

    const LAST_INDEX = LENGTH - 1;
    setSelectedPhotoData({
      index: LAST_INDEX,
      src: props.photos[LAST_INDEX],
    });
  }

  function right() {
    const LENGTH = props.photos.length;
    if (LENGTH == 0) {
      return;
    }

    let index = 0;

    index = selectedPhotoData.index + 1;
    if (index < LENGTH) {
      setSelectedPhotoData({
        index: index,
        src: props.photos[index],
      });

      return;
    }

    setSelectedPhotoData({
      index: 0,
      src: props.photos[0],
    });
  }

  return (
    <div className={styles.carousel__wrapper}>
      <div className={styles.carousel__left}>
        <button className={styles.carousel__button} onClick={left}>
          <FontAwesomeIcon icon={faArrowLeft} />
        </button>
      </div>
      <ImageWithPlaceholder
        src={selectedPhotoData.src}
        alt="x"
        width={100}
        height={100}
        iconHtml={
          <FontAwesomeIcon
            icon={faImage}
            width={200}
            color="var(--site-color)"
          />
        }
        css_maxWidth="300px"
        css_maxHeight="300px"
        css_height="auto"
        css_width="auto"
      />
      <div className={styles.carousel__right}>
        <button className={styles.carousel__button} onClick={right}>
          <FontAwesomeIcon icon={faArrowRight} />
        </button>
      </div>
      <div className={styles.carousel__caption}>
        {selectedPhotoData.index + 1}/{props.photos.length}
      </div>
    </div>
  );
}
