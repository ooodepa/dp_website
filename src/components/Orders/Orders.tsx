import Link from 'next/link';
import { useEffect, useState } from 'react';

import styles from './Orders.module.css';
import Breadcrumbs from '../Breadcrumbs/Breadcrumbs';
import AppTitle from '@/components/AppTitle/AppTitle';
import DataController from '@/packages/DateController';
import AppWrapper from '@/components/AppWrapper/AppWrapper';
import FetchOrders from '@/utils/FetchBackend/rest/api/order';
import AppKeywords from '@/components/AppKeywords/AppKeywords';
import AppContainer from '@/components/AppContainer/AppContainer';
import AppDescription from '@/components/AppDescription/AppDescription';
import { AsyncAlertExceptionHelper } from '@/utils/AlertExceptionHelper';
import GetOrderDto from '@/utils/FetchBackend/rest/api/order/dto/get-order.dto';

const SEO_TITLE = 'Мои заказы';
const SEO_DESCRIPTION = 'Мои заказы';
const SEO_KEYWORDS = 'Мои заказы';

export default function Orders() {
  const [ordersArray, setOrdersArray] = useState<GetOrderDto[]>([]);

  useEffect(() => {
    (async function () {
      try {
        const jOrders = await FetchOrders.get();
        setOrdersArray(jOrders);
      } catch (exception) {
        await AsyncAlertExceptionHelper(exception);
      }
    })();
  }, []);

  return (
    <AppWrapper>
      <AppTitle title={SEO_TITLE} />
      <AppDescription description={SEO_DESCRIPTION} />
      <AppKeywords keywords={SEO_KEYWORDS} />
      <Breadcrumbs />
      <AppContainer>
        <h2>{SEO_TITLE}</h2>
        <ul className={styles.wrapper}>
          {ordersArray.map(element => {
            const d = new Date(element.dp_date);
            const timeAgo = DataController.getTimeAgo(d);
            const strTime = DataController.getStringTime(d);
            return (
              <li key={element.dp_id}>
                <Link href={`/user-profile/orders/${element.dp_id}`}>
                  <div className={styles.timeAgo}>{strTime} </div>
                  <div className={styles.timeAgo}>{timeAgo}</div>
                  <div className={styles.positions}>
                    Позиций заказано {element.dp_orderItems.length}
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      </AppContainer>
    </AppWrapper>
  );
}
