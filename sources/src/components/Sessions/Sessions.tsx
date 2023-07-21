import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

import AppHead from '../AppHead/AppHead';
import styles from './Sessions.module.css';
import AppTitle from '../AppTitle/AppTitle';
import AppKeywords from '../AppKeywords/AppKeywords';
import Breadcrumbs from '../Breadcrumbs/Breadcrumbs';
import DataController from '@/packages/DateController';
import AppWrapper from '@/components/AppWrapper/AppWrapper';
import AppDescription from '../AppDescription/AppDescription';
import HttpException from '@/utils/FetchBackend/HttpException';
import AppContainer from '@/components/AppContainer/AppContainer';
import FetchSessions from '@/utils/FetchBackend/rest/api/sessions';
import { AsyncAlertExceptionHelper } from '@/utils/AlertExceptionHelper';

export default function Sessions() {
  const route = useRouter();
  const [sessionsData, setSessionsData] = useState<GetSessionsDto>({
    statusCode: -1,
    message: '',
    dp_current: {
      dp_agent: '',
      dp_date: '',
      dp_id: -1,
      dp_ip: '',
    },
    dp_other: [],
  });

  useEffect(() => {
    (async function () {
      try {
        const jSessionsData = await FetchSessions.get();
        setSessionsData(jSessionsData);
      } catch (exception) {
        if (
          exception instanceof HttpException &&
          exception.HTTP_STATUS === 401
        ) {
          route.back();
          return;
        }
        await AsyncAlertExceptionHelper(exception);
      }
    })();
  }, [route]);

  async function handleCloseOne(id: number) {
    try {
      await FetchSessions.closeOne(id);
      const jSessionsData = await FetchSessions.get();
      setSessionsData(jSessionsData);
    } catch (exception) {
      if (exception instanceof HttpException && exception.HTTP_STATUS === 401) {
        route.back();
        return;
      }
      await AsyncAlertExceptionHelper(exception);
    }
  }

  async function handleCloseAll() {
    try {
      await FetchSessions.closeAll();
      route.back();
    } catch (exception) {
      if (exception instanceof HttpException && exception.HTTP_STATUS === 401) {
        route.back();
        return;
      }
      await AsyncAlertExceptionHelper(exception);
    }
  }

  const curD = new Date(sessionsData.dp_current.dp_date);
  const curTimeAgo = DataController.getTimeAgo(curD);
  const curStrTime = DataController.getStringTime(curD);

  const SEO_TITLE = 'Мои устройства';
  const SEO_DESCRIPTION = 'Мои устройства';
  const SEO_KEYWORDS = 'Мои устройства';

  return (
    <AppWrapper>
      <AppTitle title={SEO_TITLE} />
      <AppDescription description={SEO_DESCRIPTION} />
      <AppKeywords keywords={SEO_KEYWORDS} />
      <AppHead />
      <Breadcrumbs />
      <AppContainer>
        <h2>Это устройство</h2>
        <ul className={styles.sessions}>
          <li>
            <div className={styles.agent}>
              {sessionsData.dp_current.dp_agent}
            </div>
            <div className={styles.ip}>IP: {sessionsData.dp_current.dp_ip}</div>
            <div className={styles.time}>{curStrTime}</div>
            <div className={styles.timeAgo}>{curTimeAgo}</div>
            <button
              className={styles.button_close_all}
              onClick={handleCloseAll}>
              Завершить все сеансы
            </button>
          </li>
        </ul>

        {sessionsData.dp_other.length === 0 ? null : (
          <>
            <h2 className={styles.title}>Активные сеансы</h2>
            <ul className={styles.sessions}>
              {sessionsData.dp_other.map(e => {
                const d = new Date(e.dp_date);
                const timeAgo = DataController.getTimeAgo(d);
                const strTime = DataController.getStringTime(d);

                return (
                  <li key={e.dp_id} className={styles.block}>
                    <div className={styles.agent}>{e.dp_agent}</div>
                    <div className={styles.ip}>IP: {e.dp_ip}</div>
                    <div className={styles.time}>{strTime}</div>
                    <div className={styles.timeAgo}>{timeAgo}</div>
                    <button
                      className={styles.button_close_one}
                      onClick={() => handleCloseOne(e.dp_id)}>
                      Завершить сеанс
                    </button>
                  </li>
                );
              })}
            </ul>
          </>
        )}
      </AppContainer>
    </AppWrapper>
  );
}
