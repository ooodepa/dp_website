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
  const [ozonCode, setOzonCode] = useState('');

  useEffect(() => {
    const jCount = BasketHelper.getCount(model);
    setCount(jCount);
  }, [model]);

  useEffect(() => {
    const ch = props.item.dp_itemCharacteristics;
    for (let i = 0; i < ch.length; ++i) {
      const currentCh = ch[i];
      if (currentCh.dp_characteristicId === 110) {
        setOzonCode(currentCh.dp_value);
        return;
      }
    }
  }, [props.item]);

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
      {ozonCode.length > 0 ? (
        <div className={styles.ozon_block}>
          <a
            href={`https://ozon.by/search/?text=${ozonCode}&from_global=true`}
            className={styles.ozon_button}>
            Купить в розницу через маркетплейс OZON
          </a>
        </div>
      ) : null}
    </div>
  );
}
