import Link from 'next/link';
import Image from 'next/image';

import styles from './ItemCategoryPosts.module.css';
import AppContainer from '@/components/AppContainer/AppContainer';
import GetItemCategoryDto from '@/utils/FetchBackend/rest/api/item-categories/dto/get-item-category.dto';

interface IProps {
  brand: string;
  categories: GetItemCategoryDto[];
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
                  {!element.dp_photoUrl ? (
                    'нет картинки'
                  ) : (
                    <Image
                      src={element.dp_photoUrl}
                      alt="x"
                      width={280}
                      height={72}
                      style={{
                        width: 'auto',
                        height: '72px',
                        objectFit: 'contain',
                        position: 'relative',
                      }}
                    />
                  )}
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
