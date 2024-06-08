import { useEffect, useState } from 'react';
import AppTitle from '@/components/AppTitle/AppTitle';
import styles from './../styles/Nomenclature.module.css';
import AppWrapper from '@/components/AppWrapper/AppWrapper';
import FetchItems from '@/utils/FetchBackend/rest/api/items';
import AppKeywords from '@/components/AppKeywords/AppKeywords';
import AppContainer from '@/components/AppContainer/AppContainer';
import Nomenclatures from '@/components/Nomenclatures/Nomenclatures';
import AppDescription from '@/components/AppDescription/AppDescription';
import { downloadFile } from '@/utils/DownloadOnBrowser/DownloadOnBrowser';
import GetItemDto from '@/utils/FetchBackend/rest/api/items/dto/get-item.dto';
import NomenclatureBreadCrumbs from '@/components/NomenclatureBreadCrumbs/NomenclatureBreadCrumbs';

const limit = 20;
const dp_1cParentId = '0c56bfe0-33f4-42a2-85a5-3b14978cb728';

export default function NomenclaturePage() {
  const [it, setIt] = useState<GetItemDto[]>([]);
  // const [isFetching, setIsFetching] = useState<boolean>(false);
  // const [lastPage, setLastPage] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);

  // useEffect(() => {
  //   document.addEventListener('scroll', scrollHandler);
  //   return function () {
  //     document.removeEventListener('scroll', scrollHandler);
  //   };
  // }, []);

  useEffect(() => {
    (async function () {
      // try {
      //   const jTemp = await FetchItems.getPagination({
      //     dp_1cParentId,
      //     limit,
      //     page: 1,
      //   });
      //   const arr = jTemp.data.sort(
      //     (a, b) => a.dp_sortingIndex - b.dp_sortingIndex,
      //   );
      //   setIt(arr);
      //   setLastPage(jTemp.pagination.last_page);
      // } catch (exception) {}
      try {
        const jIt = await FetchItems.getPagination({
          dp_1cParentId,
          limit: 10000,
          page: 1,
        });
        const arr = jIt.data.sort(
          (a, b) => a.dp_sortingIndex - b.dp_sortingIndex,
        );
        setIt(arr);
      } catch (exception) {}
    })();
  }, []);

  // useEffect(() => {
  //   (async function () {
  //     if (!isFetching) {
  //       return;
  //     }

  //     const page = currentPage + 1;

  //     if (page >= lastPage) {
  //       // console.log('Не загружать, так ка последняя страница');
  //       return;
  //     }

  //     setCurrentPage(page);

  //     try {
  //       const jTemp = await FetchItems.getPagination({
  //         dp_1cParentId,
  //         limit,
  //         page,
  //       });
  //       const arr = [...it, ...jTemp.data];
  //       setIt(arr);
  //       setLastPage(jTemp.pagination.last_page);
  //     } catch (exception) {}
  //   })();
  // }, [isFetching]);

  // const scrollHandler = (e: UIEvent<Document>) => {
  //   const scrollHeight = document.documentElement.scrollHeight;
  //   const scrollTop = document.documentElement.scrollTop;
  //   const innerHeight = window.innerHeight;
  //   // console.log({
  //   //     scrollHeight,
  //   //     scrollTop,
  //   //     innerHeight,
  //   //     flag: (scrollHeight - scrollTop === innerHeight)
  //   // });

  //   if (scrollHeight - scrollTop - innerHeight <= 5) {
  //     setIsFetching(true);
  //   } else {
  //     setIsFetching(false);
  //   }
  // };

  function EventDownloadFile() {
    downloadFile(
      `Номенклатура_${dp_1cParentId}.json`,
      JSON.stringify(it, null, 2),
    );
  }

  return (
    <AppWrapper>
      <AppTitle title={'Номенклатура'} />
      <AppDescription description={'Номенклатура'} />
      <AppKeywords keywords={'Номенклатура'} />
      <NomenclatureBreadCrumbs model={'root'} />
      <AppContainer>
        <div className={styles.wrapper}>
          <h1>Номенклатура</h1>
          <Nomenclatures items={it} />
          <details className={styles.details}>
            <summary>Для IT-отдела</summary>
            <table className={styles.characteristics_table}>
              <tbody>
                <tr>
                  <td>ID</td>
                  <td>{dp_1cParentId}</td>
                </tr>
                <tr>
                  <td>Список</td>
                  <td>
                    <button onClick={EventDownloadFile}>Скачать JSON</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </details>
        </div>
      </AppContainer>
    </AppWrapper>
  );
}
