import Link from 'next/link';
import Image from 'next/image';

import styles from './ItemCategoryPosts.module.css';
import AppContainer from '@/components/AppContainer/AppContainer';
import ItemCategoryDto from '@/dto/item-category/ItemCategoryDto';

interface IProps {
  brand: string;
  categories: ItemCategoryDto[];
}

export default function ItemCategoryPosts(props: IProps) {
  return (
    <AppContainer>
      <ul className={styles.posts}>
        {props.categories.map(element => {
          if (element.dp_isHidden) {
            return null;
          }

          return (
            <li key={element.dp_id}>
              <Link href={`/products/${props.brand}/${element.dp_urlSegment}`}>
                <div className={styles.post__image_block}>
                  <Image
                    src={element.dp_photoUrl}
                    alt="нет картинки"
                    height={100}
                    width={100}
                    style={{
                      height: 'auto',
                      objectFit: 'contain',
                      position: 'relative',
                    }}
                  />
                </div>
                <div className={styles.post__title}>{element.dp_name}</div>
              </Link>
            </li>
          );
        })}
      </ul>
    </AppContainer>
  );
}
