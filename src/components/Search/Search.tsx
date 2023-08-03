import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/router';
import {
  faBasketShopping,
  faXmark,
  faLink,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import styles from './Search.module.css';
import BasketHelper from '@/utils/BasketHelper';
import AppContainer from '../AppContainer/AppContainer';
import FetchItems from '@/utils/FetchBackend/rest/api/items';
import GetItemDto from '@/utils/FetchBackend/rest/api/items/dto/get-item.dto';

interface CustomItem extends GetItemDto {
  isInBasket: boolean;
}

export default function Search() {
  const route = useRouter();
  const [search, setSearch] = useState('');
  const [items, setItems] = useState<CustomItem[]>([]);

  async function getResults(text: string) {
    setSearch(text);
    if (text.length === 0) {
      setItems([]);
      return;
    }

    try {
      const jItems = await FetchItems.search({ search: text });

      const jBasket = BasketHelper.getBasket();
      const modelsInBasket = Object.keys(jBasket);

      const customItems: CustomItem[] = jItems.map(e => {
        const model = e.dp_model;
        if (modelsInBasket.indexOf(model) !== -1) {
          return { ...e, isInBasket: true };
        }
        return { ...e, isInBasket: false };
      });

      setItems(customItems);
    } catch (exception) {}
  }

  function clearSearch() {
    setItems([]);
    setSearch('');
  }

  function addToBasket(model: string) {
    BasketHelper.plus(model);

    const jBasket = BasketHelper.getBasket();
    const modelsInBasket = Object.keys(jBasket);

    const customItems: CustomItem[] = items.map(e => {
      const model = e.dp_model;
      if (modelsInBasket.indexOf(model) !== -1) {
        return { ...e, isInBasket: true };
      }
      return { ...e, isInBasket: false };
    });

    setItems(customItems);
  }

  function removeFromBasket(model: string) {
    BasketHelper.removeModel(model);

    const jBasket = BasketHelper.getBasket();
    const modelsInBasket = Object.keys(jBasket);

    const customItems: CustomItem[] = items.map(e => {
      const model = e.dp_model;
      if (modelsInBasket.indexOf(model) !== -1) {
        return { ...e, isInBasket: true };
      }
      return { ...e, isInBasket: false };
    });

    setItems(customItems);
  }

  return (
    <AppContainer>
      <div className={styles.search_block}>
        <input
          type="text"
          placeholder="Поиск по модели, наименованию"
          value={search}
          onChange={event => getResults(event.target.value)}
        />
        <button title="Очистить результаты" onClick={clearSearch}>
          <FontAwesomeIcon icon={faXmark} />
        </button>
        {/* <button title="Показать все результаты">Найти</button> */}
      </div>
      {items.length === 0 ? null : (
        <ul className={styles.results_block}>
          {items.map(e => {
            return (
              <li
                key={e.dp_id}
                title={`Открыть страницу об этой номенклатуре (${e.dp_model})`}>
                <div className={styles.results__text}>
                  <div className={styles.model}>{e.dp_model}</div>
                  <div>{e.dp_name}</div>
                </div>
                <Link
                  href={`/redirect/items/${e.dp_id}`}
                  className={styles.search__button}>
                  <FontAwesomeIcon icon={faLink} />
                </Link>
                {e.isInBasket ? (
                  <button
                    className={`${styles.search__button} ${styles.search__button_remove}`}
                    title="Убрать из корзины"
                    onClick={() => removeFromBasket(e.dp_model)}>
                    <FontAwesomeIcon icon={faXmark} />
                  </button>
                ) : (
                  <button
                    className={`${styles.search__button} ${styles.search__button_add}`}
                    title="Добавить в корзину"
                    onClick={() => addToBasket(e.dp_model)}>
                    <FontAwesomeIcon icon={faBasketShopping} />
                  </button>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </AppContainer>
  );
}
