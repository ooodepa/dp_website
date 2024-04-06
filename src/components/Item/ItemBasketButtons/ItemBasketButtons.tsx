import { useEffect, useState } from 'react';

import BasketHelper from '@/utils/BasketHelper';
import AppLink from '@/components/AppLink/AppLink';
import styles from './ItemBasketButtons.module.css';
import AppButton from '@/components/AppButton/AppButton';
import ItemDto from '@/utils/FetchBackend/rest/api/items/dto/item.dto';

interface IItemBasketButtons {
  item: ItemDto;
}

export default function ItemBasketButtons(props: IItemBasketButtons) {
  const [count, setCount] = useState<number>(0);
  const model = props.item.dp_seoUrlSegment;

  useEffect(() => {
    const jCount = BasketHelper.getCount(model);
    setCount(jCount);
  }, [model]);

  function plus() {
    BasketHelper.plus(model);
    const c = BasketHelper.getCount(model);
    setCount(c);
  }

  return (
    <div className={styles.wrapper}>
      <h3>Добавляйте в корзину и отправляйте нам заявку</h3>
      <div className={styles.buttons}>
        <AppButton onClick={plus}>
          Добавить в корзину {count === 0 ? null : ` (${count})`}
        </AppButton>
        <AppLink href="/basket">Просмотреть корзину</AppLink>
      </div>
      {props.item.dp_ozonIds
        .split('\n')
        .filter(e => e.length > 0)
        .map(ozonId => {
          return (
            <div className={styles.ozon_block} key={ozonId}>
              <a
                href={`https://ozon.by/products/${ozonId}`}
                className={styles.ozon_button}>
                Купить в розницу через маркетплейс OZON (SKU {ozonId})
              </a>
            </div>
          );
        })}
    </div>
  );
}
