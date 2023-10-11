import Link from 'next/link';
import Image from 'next/image';
import { faFileImage } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

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
              <Link
                href={`/products/${props.brand}/${element.dp_urlSegment}`}
                title="Просмотреть номенклатуру этой категории">
                <div className={styles.post__image_block}>
                  {!element.dp_photoUrl ? (
                    <FontAwesomeIcon icon={faFileImage} />
                  ) : (
                    <Image
                      src={element.dp_photoUrl}
                      alt="x"
                      width={160}
                      height={160}
                      style={{
                        maxWidth: '160px',
                        maxHeight: '160px',
                        objectFit: 'contain',
                        position: 'relative',
                        textAlign: 'center',
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
