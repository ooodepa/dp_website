import Link from 'next/link';
import Image from 'next/image';

import ItemDto from '@/dto/item/ItemDto';
import styles from './ItemPosts.module.css';
import AppContainer from '@/components/AppContainer/AppContainer';

interface IProps {
  brand: string;
  category: string;
  items: ItemDto[];
}

export default function ItemPosts(props: IProps) {
  return (
    <AppContainer>
      <ul className={styles.posts}>
        {props.items.map(element => {
          return (
            <li key={element.dp_id}>
              <Link
                href={`/products/${props.brand}/${props.category}/${element.dp_model}`}>
                <div className={styles.post__wrapper}>
                  <div className={styles.post__content}>
                    <div className={styles.post__image_block}>
                      {!element.dp_photoUrl ? 'нет картинки' : (
                        <Image
                          src={element.dp_photoUrl}
                          alt=" "
                          height={100}
                          width={100}
                          style={{
                            height: 'auto',
                            objectFit: 'contain',
                            position: 'relative',
                          }}
                        />
                      )}
                    </div>
                    <div className={styles.post__model}>{element.dp_model}</div>
                    <div className={styles.post__title}>{element.dp_name}</div>
                  </div>
                  <div className={styles.post__footer}>
                    <div className={styles.post__cost}>
                      Br {Number(element.dp_cost).toFixed(2)}
                    </div>
                  </div>
                </div>
              </Link>
            </li>
          );
        })}
      </ul>
    </AppContainer>
  );
}
