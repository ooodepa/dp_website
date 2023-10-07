import Link from 'next/link';
import Image from 'next/image';
import { faFileImage } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

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
          const costNds = Number(
            element.dp_cost * 0.2 + element.dp_cost,
          ).toFixed(2);

          const code = element.dp_itemCharacteristics.find(
            e => e.dp_characteristicId === 21,
          )?.dp_value;
          const oldCode = element.dp_itemCharacteristics.find(
            e => e.dp_characteristicId === 17,
          )?.dp_value;

          return (
            <li key={element.dp_id}>
              <Link
                href={`/products/${props.brand}/${props.category}/${element.dp_model}`}
                title="Открыть страницу этой номенклатуры">
                <div className={styles.post__wrapper}>
                  <div className={styles.post__content}>
                    <div className={styles.post__image_block}>
                      {!element.dp_photoUrl ? (
                        <FontAwesomeIcon icon={faFileImage} />
                      ) : (
                        <Image
                          src={element.dp_photoUrl}
                          alt="x"
                          width={160}
                          height={100}
                          style={{
                            width: 'auto',
                            height: 'auto',
                            maxWidth: '240px',
                            maxHeight: '100px',
                            objectFit: 'contain',
                            position: 'relative',
                            textAlign: 'center',
                          }}
                        />
                      )}
                    </div>
                    {code ? (
                      <div className={styles.post__model}>(артикул) {code}</div>
                    ) : (
                      <div className={styles.post__model}>
                        {element.dp_model}
                      </div>
                    )}
                    {oldCode ? (
                      <div className={styles.post__model}>
                        (старый артикул) {oldCode}
                      </div>
                    ) : null}
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
