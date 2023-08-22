import Image from 'next/image';
import Link from 'next/link';

import styles from './BrandItemPosts.module.css';
import AppContainer from '@/components/AppContainer/AppContainer';
import GetItemBrandDto from '@/utils/FetchBackend/rest/api/item-brands/dto/get-item-brand.dto';

interface IProps {
  brands: GetItemBrandDto[];
}

export default function BrandItemPosts(props: IProps) {
  return (
    <AppContainer>
      <ul className={styles.posts}>
        {props.brands.map(element => {
          if (element.dp_isHidden) {
            return null;
          }

          return (
            <li key={element.dp_id}>
              <Link
                href={`/products/${element.dp_urlSegment}`}
                title="Просмотреть категории этого бренда">
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
