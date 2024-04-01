import Link from 'next/link';
import Image from 'next/image';
import { faFileImage } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import styles from './ItemPosts.module.css';
import AppContainer from '@/components/AppContainer/AppContainer';
import GetItemDto from '@/utils/FetchBackend/rest/api/items/dto/get-item.dto';
import GetItemCategoryDto from '@/utils/FetchBackend/rest/api/item-categories/dto/get-item-category.dto';

interface IProps {
  brand: string;
  category: string;
  items: GetItemDto[];
  itemCategory: GetItemCategoryDto;
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
                href={`/products/${props.brand}/${props.category}/${element.dp_seoUrlSegment}`}
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
                          height={160}
                          style={{
                            width: 'auto',
                            height: 'auto',
                            maxWidth: '160px',
                            maxHeight: '160px',
                            objectFit: 'contain',
                            position: 'relative',
                            textAlign: 'center',
                          }}
                        />
                      )}
                    </div>
                    {code ? (
                      <div className={styles.post__model}>Артикул - {code}</div>
                    ) : (
                      <div className={styles.post__model}>
                        {element.dp_seoUrlSegment}
                      </div>
                    )}
                    {oldCode ? (
                      <div className={styles.post__model}>
                        Старый артикул - {oldCode}
                      </div>
                    ) : null}
                    {element.dp_seoUrlSegment === element.dp_seoTitle ? null : (
                      <div className={styles.post__title}>
                        {element.dp_seoTitle}
                      </div>
                    )}
                  </div>
                  <div className={styles.post__footer}>
                    {costIsView ? (
                      <>
                        <div className={styles.post__costNoNds}>
                          Цена без НДС: BYN {costNoNds}
                        </div>
                        <div className={styles.post__costNds}>
                          Цена с НДС: BYN {costNds}
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
      <table className={styles.item__table}>
        <tbody>
          <tr>
            <td colSpan={2} style={{ textAlign: 'center' }}>
              Данные категории номенклатуры:
            </td>
          </tr>
          <tr>
            <td rowSpan={2}>Наименование</td>
            <td>{props.itemCategory.dp_seoTitle}</td>
          </tr>
          <tr>
            <td>
              <Link href={`/products/${props.brand}/${props.category}`}>
                ({props.category})
              </Link>
            </td>
          </tr>
          <tr>
            <td>Описание</td>
            <td style={{ whiteSpace: 'pre-wrap' }}>
              {props.itemCategory.dp_seoDescription}
            </td>
          </tr>
          <tr>
            <td>Ключевые слова</td>
            <td style={{ whiteSpace: 'pre-line' }}>
              {props.itemCategory.dp_seoKeywords.length === 0
                ? 'нет'
                : props.itemCategory.dp_seoKeywords}
            </td>
          </tr>
        </tbody>
      </table>
    </AppContainer>
  );
}
