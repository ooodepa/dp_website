import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { convert as numberToWordsRu } from 'number-to-words-ru';

import Image from 'next/image';
import styles from './Basket.module.css';
import AppHead from '../AppHead/AppHead';
import AppModal from '../AppModal/AppModal';
import AppTitle from '../AppTitle/AppTitle';
import BasketHelper from '@/utils/BasketHelper';
import AppWrapper from '../AppWrapper/AppWrapper';
import Breadcrumbs from '../Breadcrumbs/Breadcrumbs';
import AppKeywords from '../AppKeywords/AppKeywords';
import AppContainer from '../AppContainer/AppContainer';
import FetchUsers from '@/utils/FetchBackend/rest/api/users';
import FetchItems from '@/utils/FetchBackend/rest/api/items';
import AppDescription from '../AppDescription/AppDescription';
import FetchOrders from '@/utils/FetchBackend/rest/api/order';
import IBasketItem from '@/utils/BasketHelper/dto/IBasketItem.dto';
import { AsyncAlertExceptionHelper } from '@/utils/AlertExceptionHelper';
import GetItemDto from '@/utils/FetchBackend/rest/api/items/dto/get-item.dto';
import CreateOrderDto from '@/utils/FetchBackend/rest/api/order/dto/create-order.dto';

interface ITotalBasketCounter {
  totalNoNds: string;
  totalNds: string;
  totalSum: string;
  positions: number;
}

export default function Basket() {
  const route = useRouter();
  const [totalBasketCounter, setTotalBasketCounter] =
    useState<ITotalBasketCounter>({
      totalNoNds: '0.00',
      totalNds: '0.00',
      totalSum: '0.00',
      positions: 0,
    });
  const [isLogin, setIsLogin] = useState<boolean>(false);
  const [modal, setModal] = useState(<></>);
  const [basketArray, setBasketArray] = useState<IBasketItem[]>([]);
  const [items, setItems] = useState<GetItemDto[]>([]);

  const SEO_TITLE = 'Корзина';
  const SEO_DESCRIPTION = 'Корзина';
  const SEO_KEYWORDS = 'Корзина';

  useEffect(() => {
    (async function () {
      try {
        const models = BasketHelper.getModels();

        const jItems = await FetchItems.filterOneByModels({ models });
        setItems(jItems);

        const jBasketArray = BasketHelper.getBasketArray(jItems);
        setBasketArray(jBasketArray);
        calcBasket(jBasketArray);
      } catch (exception) {
        await AsyncAlertExceptionHelper(exception);
      }

      try {
        const isLogin = await FetchUsers.isLogin();
        if (isLogin) {
          setIsLogin(true);
        }
      } catch (exception) {
        await AsyncAlertExceptionHelper(exception);
      }
    })();
  }, []);

  function updateBasket() {
    const jBasketArray = BasketHelper.getBasketArray(items);
    setBasketArray(jBasketArray);
    calcBasket(jBasketArray);
  }

  function calcBasket(basketArr: IBasketItem[]) {
    let totalNoNds = 0;
    let totalNds = 0;
    let totalSum = 0;
    let positions = 0;
    for (let i = 0; i < basketArr.length; i++) {
      const dp_cost = basketArr[i].dp_cost;
      const dp_count = basketArr[i].dp_count;
      totalNoNds += Number(Number(dp_cost * dp_count).toFixed(2));
      totalNds += Number(Number(dp_cost * dp_count * 0.2).toFixed(2));
      totalSum += Number(Number(totalNoNds + totalNds).toFixed(2));
      positions += dp_count;
    }

    setTotalBasketCounter({
      positions,
      totalNds: Number(totalNds).toFixed(2),
      totalNoNds: Number(totalNoNds).toFixed(2),
      totalSum: Number(totalSum).toFixed(2),
    });
  }

  function plus(model: string) {
    BasketHelper.plus(model);
    updateBasket();
  }

  function minus(model: string) {
    BasketHelper.minus(model);
    updateBasket();
  }

  function changeCount(model: string, strCount: string) {
    BasketHelper.setCount(model, Number(strCount));
    updateBasket();
  }

  async function sendOrder() {
    try {
      if (!isLogin) {
        setModal(
          <AppModal
            title="Отправка заявки"
            message="Для того чтобы отправить заявку, войдите в свой аккаунт.">
            <button onClick={() => setModal(<></>)}>Закрыть</button>
          </AppModal>,
        );
        return;
      }

      const dto: CreateOrderDto = {
        dp_orderItems: basketArray.map(e => ({
          dp_count: e.dp_count,
          dp_itemId: e.dp_id,
        })),
      };
      const jOrder = await FetchOrders.create(dto);
      BasketHelper.clear();
      const jBasketArray = BasketHelper.getBasketArray(items);
      setBasketArray(jBasketArray);

      setModal(
        <AppModal
          title="Заявка"
          message='Заявка отправлена менеджеру. Хотите получить документ "Cчёт-фатура" на почту'>
          <button
            onClick={() =>
              route.push(`/user-profile/orders/${jOrder.dp_id}/get-check`)
            }>
            Получить счёт-фактуру
          </button>
          <button onClick={() => setModal(<></>)}>Закрыть</button>
        </AppModal>,
      );
    } catch (exception) {
      await AsyncAlertExceptionHelper(exception);
    }
  }

  function BasketButtons() {
    return basketArray.length === 0 ? (
      <div className={styles.center_block}>
        <Link href="/products">Выбрать товары</Link>
      </div>
    ) : (
      <div className={styles.center_block}>
        <button onClick={sendOrder}>Отправить заявку</button>
        {isLogin ? null : (
          <Link href="/user-profile/sign-in">Войти в аккаунт</Link>
        )}
      </div>
    );
  }

  return (
    <AppWrapper>
      {modal}
      <AppTitle title={SEO_TITLE} />
      <AppDescription description={SEO_DESCRIPTION} />
      <AppKeywords keywords={SEO_KEYWORDS} />
      <AppHead />
      <Breadcrumbs />
      <h2>Корзина</h2>
      <AppContainer>
        {basketArray.length === 0 ? null : (
          <div className={styles.center_block}>
            <Link href="#my-table">Посмотреть таблицу расчётов</Link>
          </div>
        )}
        <ul className={styles.posts}>
          {basketArray.map(element => {
            const costIsView = Number(element.dp_cost) === 0 ? false : true;
            const costNoNds = Number(element.dp_cost).toFixed(2);
            const costNds = Number(
              element.dp_cost * 0.2 + element.dp_cost,
            ).toFixed(2);
            const costTotal = Number(
              Number(costNds) * element.dp_count,
            ).toFixed(2);

            return (
              <li key={element.dp_id}>
                <Link href="#">
                  <div className={styles.post__wrapper}>
                    <div className={styles.post__content}>
                      <div className={styles.post__image_block}>
                        {!element.dp_img ? (
                          'нет картинки'
                        ) : (
                          <Image
                            src={element.dp_img}
                            alt="x"
                            width={280}
                            height={72}
                            style={{
                              width: 'auto',
                              height: '72px',
                              objectFit: 'contain',
                              position: 'relative',
                              textAlign: 'center',
                            }}
                          />
                        )}
                      </div>
                      <div className={styles.post__model}>
                        {element.dp_model}
                      </div>
                      <div className={styles.post__title}>
                        {element.dp_name}
                      </div>
                    </div>
                    <div className={styles.post__footer}>
                      <div className={styles.counter_block}>
                        <button
                          onClick={() => minus(element.dp_model)}
                          title="Убрать одну позицию">
                          -
                        </button>
                        <input
                          type="number"
                          title="Тут можно указать определенное количество для заказа"
                          value={element.dp_count}
                          onChange={event =>
                            changeCount(element.dp_model, event.target.value)
                          }
                        />
                        <button
                          onClick={() => plus(element.dp_model)}
                          title="Добавить одну позицию">
                          +
                        </button>
                      </div>
                      {costIsView ? (
                        <>
                          <div className={styles.post__costNoNds}>
                            (без НДС) BYN {costNoNds}
                          </div>
                          <div className={styles.post__costNds}>
                            (с НДС) BYN {costNds}
                          </div>
                          <div className={styles.post__count}>
                            {element.dp_count} шт. по цене BYN {costNds}
                          </div>
                          <div className={styles.post__total}>
                            (итого) BYN {costTotal}
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

        {basketArray.length === 0 ? null : (
          <>
            <div className={styles.table_wrapper}>
              <table className={styles.table}>
                <caption id="my-table">Таблица - расчёты</caption>
                <thead>
                  <tr>
                    <th>№</th>
                    <th>Картинка</th>
                    <th>Наименование</th>
                    <th>Цена, руб. коп.</th>
                    <th>НДС</th>
                    <th>Количество</th>
                    <th>Сумма, руб. коп.</th>
                    <th>Сумма НДС, руб. коп.</th>
                    <th>Всего с НДС, руб. коп.</th>
                  </tr>
                </thead>
                <tbody>
                  {basketArray.map((element, index) => {
                    const {
                      dp_cost,
                      dp_count,
                      dp_id,
                      dp_img,
                      dp_model,
                      dp_name,
                    } = element;
                    const cost = Number(dp_cost).toFixed(2);
                    const nds = Number(dp_cost * 0.2).toFixed(2);
                    const sumNoNds = Number(dp_cost * dp_count).toFixed(2);
                    const sumNds = Number(Number(nds) * dp_count).toFixed(2);
                    const totalSum = Number(
                      Number(sumNoNds) + Number(sumNds),
                    ).toFixed(2);
                    return (
                      <tr key={dp_id}>
                        <td className={styles.tdCenter}>{index + 1}</td>
                        <td className={styles.tdCenter}>
                          <Image
                            src={dp_img}
                            width={64}
                            height={64}
                            alt="x"
                            style={{ width: 'auto' }}
                          />
                        </td>
                        <td>
                          {dp_name}, {dp_model}
                        </td>
                        <td className={styles.tdRight}>{cost}</td>
                        <td className={styles.tdRight}>{nds}</td>
                        <td className={styles.tdCenter}>{dp_count}</td>
                        <td className={styles.tdRight}>{sumNoNds}</td>
                        <td className={styles.tdRight}>{sumNds}</td>
                        <td className={styles.tdRight}>{totalSum}</td>
                      </tr>
                    );
                  })}
                  <tr>
                    <th colSpan={5} className={styles.tdRight}>
                      Итого
                    </th>
                    <th>{totalBasketCounter.positions}</th>
                    <th>{totalBasketCounter.totalNoNds}</th>
                    <th>{totalBasketCounter.totalNds}</th>
                    <th>{totalBasketCounter.totalSum}</th>
                  </tr>
                </tbody>
              </table>
            </div>
            <p>Сумма НДС: {numberToWordsRu(totalBasketCounter.totalNds)}</p>
            <p>
              Всего к оплате на сумму с НДС:{' '}
              {numberToWordsRu(totalBasketCounter.totalSum)}
            </p>
          </>
        )}

        <BasketButtons />
      </AppContainer>
    </AppWrapper>
  );
}
