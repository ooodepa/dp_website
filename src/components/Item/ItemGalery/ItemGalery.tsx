import { useEffect, useState } from 'react';

import styles from './ItemGalery.module.css';
import ItemDto from '@/utils/FetchBackend/rest/api/items/dto/item.dto';

interface IProps {
  item: ItemDto;
}

export default function ItemGalery(props: IProps) {
  const [selectedImage, setSelectedImage] = useState<string>('');
  const [images, setImages] = useState<string[]>([]);

  useEffect(() => {
    const imgs = props.item.dp_itemGalery.map(e => e.dp_photoUrl);
    imgs.unshift(props.item.dp_photoUrl);
    setImages(imgs);
    if (imgs.length > 0) {
      setSelectedImage(imgs[0]);
    }
  }, [props.item.dp_itemGalery, props.item.dp_photoUrl]);

  if (images.length === 0) {
    return null;
  }

  return (
    <div className={styles.wrapper} id="itemImage">
      <h3>Галерея</h3>
      <div className={styles.oneImage}>
        <img src={selectedImage} alt="x" />
      </div>
      <div className={styles.manyImages}>
        <ul>
          {images.map(img_url => {
            return (
              <li
                key={img_url}
                onMouseEnter={() => setSelectedImage(img_url)}
                title="Кликните для просмотра картинки">
                <a href="#itemImage">
                  <img src={img_url} alt="x" />
                </a>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
