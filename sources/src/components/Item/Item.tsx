import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState } from 'react';

import styles from './Item.module.css';
import AppLink from '../AppLink/AppLink';
import BasketHelper from '@/utils/BasketHelper';
import AppContainer from '@/components/AppContainer/AppContainer';
import ItemDto from '@/utils/FetchBackend/rest/api/items/dto/item-with-id.dto';
import GetItemBrandDto from '@/utils/FetchBackend/rest/api/item-brands/dto/get-item-brand.dto';
import GetItemCategoryDto from '@/utils/FetchBackend/rest/api/item-categories/dto/get-item-category.dto';
import GetItemCharacteristicDto from '@/utils/FetchBackend/rest/api/item-characteristics/dto/get-item-characteristic.dto';

interface IProps {
  item: ItemDto;
  itemCharacteristics: GetItemCharacteristicDto[];
  itemBrand: GetItemBrandDto;
  itemCategory: GetItemCategoryDto;
  brand: string;
  category: string;
}

export default function Item(props: IProps) {
  const [count, setCount] = useState<number>(0);

  const model = props.item.dp_model;
  const costIsView = Number(props.item.dp_cost) === 0 ? false : true;
  const costNoNds = Number(props.item.dp_cost).toFixed(2);
  const costNds = Number(props.item.dp_cost * 0.2).toFixed(2);
  const costTotal = Number(Number(costNoNds) + Number(costNds)).toFixed(2);

  useEffect(() => {
    const c = BasketHelper.getCount(model);
    setCount(c);
  }, [model]);

  function plus() {
    BasketHelper.plus(model);
    const c = BasketHelper.getCount(model);
    setCount(c);
  }

  function minus() {
    BasketHelper.minus(model);
    const c = BasketHelper.getCount(model);
    setCount(c);
  }

  function changeCount(strCount: string) {
    BasketHelper.setCount(model, Number(strCount));
    const c = BasketHelper.getCount(model);
    setCount(c);
  }

  return (
    <AppContainer>
      <h1>{props.item.dp_name}</h1>
      <div className={styles.item__image}>
        {!props.item.dp_photoUrl ? null : (
          <Image src={props.item.dp_photoUrl} alt="x" width={280} height={72} />
        )}
      </div>
      {props.item.dp_cost === 0 ? null : (
        <>
          <div className={styles.counter_block}>
            <button onClick={minus} title="Убрать одну позицию">
              -
            </button>
            <input
              type="text"
              title="Тут можно указать определенное количество для заказа"
              value={count}
              onChange={event => changeCount(event.target.value)}
            />
            <button onClick={plus} title="Добавить одну позицию">
              +
            </button>
          </div>
          <div className={styles.counter_bottom_button}>
            <AppLink href="/basket">Посмотреть корзину</AppLink>
          </div>
        </>
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
              {props.itemBrand.dp_name}
              <br />
              <Link
                href={`/products/${props.brand}`}
                title="Перейти на страницу с номенлатурой этого бренда">
                ({props.brand})
              </Link>
            </td>
          </tr>
          <tr>
            <td>Категория</td>
            <td>
              {props.itemCategory.dp_name}
              <br />
              <Link
                href={`/products/${props.brand}/${props.category}`}
                title="Перейти на страницу с номенлатурой этой категории">
                ({props.category})
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
          {costIsView ? (
            <>
              <tr>
                <td>Цена за одну штуку без НДС</td>
                <td>BYN {costNoNds}</td>
              </tr>
              <tr>
                <td>НДС</td>
                <td>BYN {costNds}</td>
              </tr>
              <tr>
                <td>Цена за одну штуку c НДС</td>
                <td>BYN {costTotal}</td>
              </tr>
            </>
          ) : (
            <>
              <tr>
                <td>Цена за одну штуку без НДС</td>
                <td rowSpan={3}>цена не задана</td>
              </tr>
              <tr>
                <td>НДС</td>
              </tr>
              <tr>
                <td>Цена за одну штуку c НДС</td>
              </tr>
            </>
          )}
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
