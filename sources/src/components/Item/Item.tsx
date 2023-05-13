import Link from 'next/link';
import Image from 'next/image';

import styles from './Item.module.css';
import AppContainer from '@/components/AppContainer/AppContainer';
import ItemDto from '@/utils/FetchBackend/rest/api/items/dto/item-with-id.dto';
import GetItemCharacteristicDto from '@/utils/FetchBackend/rest/api/item-characteristics/dto/get-item-characteristic.dto';

interface IProps {
  item: ItemDto;
  itemCharacteristics: GetItemCharacteristicDto[];
  brand: string;
  category: string;
}

export default function Item(props: IProps) {
  return (
    <AppContainer>
      <h1>{props.item.dp_name}</h1>
      {!props.item.dp_photoUrl ? null : (
        <Image
          src={props.item.dp_photoUrl}
          alt=" "
          height={100}
          width={100}
          style={{
            height: 'auto',
            objectFit: 'contain',
            position: 'relative',
          }}
          className={styles.item__image}
        />
      )}
      <table className={styles.item__table}>
        <tbody>
          <tr>
            <td colSpan={2} style={{ textAlign: 'center' }}>
              Данные номенклатуры:
            </td>
          </tr>
          <tr>
            <td>Наименование</td>
            <td>{props.item.dp_name}</td>
          </tr>
          <tr>
            <td>Бренд</td>
            <td>
              <Link
                href={`/products/${props.brand}`}
                title="Перейти на страницу с номенлатурой этого бренда">
                {props.brand}
              </Link>
            </td>
          </tr>
          <tr>
            <td>Категория</td>
            <td>
              <Link
                href={`/products/${props.brand}/${props.category}`}
                title="Перейти на страницу с номенлатурой этой категории">
                {props.category}
              </Link>
            </td>
          </tr>
          <tr>
            <td>Модель</td>
            <td>
              <Link
                href={`/products/${props.brand}/${props.category}/${props.item.dp_model}`}
                title="Перейти на страницу с номенлатурой (вы уже на ней)">
                {props.item.dp_model}
              </Link>
            </td>
          </tr>
          <tr>
            <td>Цена за одну штуку без НДС</td>
            <td>Br {Number(props.item.dp_cost).toFixed(2)}</td>
          </tr>
          <tr>
            <td colSpan={2} style={{ border: 'none' }}></td>
          </tr>
          <tr>
            <td colSpan={2} style={{ textAlign: 'center' }}>
              Дополнительные характеристики:
            </td>
          </tr>
          {props.item.dp_itemCharacteristics?.length ? null : (
            <tr>
              <td
                colSpan={2}
                style={{ textAlign: 'center', fontWeight: 'normal' }}>
                Дополнительные характеристики не указаны
              </td>
            </tr>
          )}
          {props.item?.dp_itemCharacteristics?.map(element => {
            let characteristicName = '';
            for (let i = 0; i < props.itemCharacteristics.length; ++i) {
              if (
                element.dp_characteristicId ==
                props.itemCharacteristics[i].dp_id
              ) {
                characteristicName = props.itemCharacteristics[i].dp_name;
                break;
              }
            }

            return (
              <tr key={element.dp_id}>
                <td>{characteristicName}</td>
                <td>{element.dp_value}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </AppContainer>
  );
}
