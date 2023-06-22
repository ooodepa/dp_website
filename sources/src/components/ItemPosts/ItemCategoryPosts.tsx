import Link from 'next/link';
import Image from 'next/image';

import styles from './ItemPosts.module.css';
import AppContainer from '@/components/AppContainer/AppContainer';
import GetItemDto from '@/utils/FetchBackend/rest/api/items/dto/get-item.dto';

interface IProps {
  brand: string;
  category: string;
  items: GetItemDto[];
}

export default function ItemPosts(props: IProps) {
  return (
    <AppContainer>
      <ul className={styles.posts}>
        {props.items.map(element => {
          const costIsView = Number(element.dp_cost) === 0 ? false : true;
          const costNoNds = Number(element.dp_cost).toFixed(2);
          const costNds = Number(element.dp_cost * 0.2 + element.dp_cost).toFixed(2);

          return (
            <li key={element.dp_id}>
              <Link
                href={`/products/${props.brand}/${props.category}/${element.dp_model}`}>
                <div className={styles.post__wrapper}>
                  <div className={styles.post__content}>
                    <div className={styles.post__image_block}>
                      {!element.dp_photoUrl ? (
                        'нет картинки'
                      ) : (
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
                    {costIsView ? (
                      <>
                        <div className={styles.post__costNoNds}>
                          (без НДС) BYN {costNoNds}
                        </div>
                        <div className={styles.post__costNds}>
                          (с НДС) BYN {costNds}
                        </div>
                      </>
                    ) : null}
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
