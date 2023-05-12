import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

import AppModal from '@/components/AppModal/AppModal';
import FetchUsers from '@/utils/FetchBackend/rest/api/users';
import FetchItemBrand from '@/utils/FetchBackend/rest/api/item-brands';
import YouAreNotAdmin from '@/components/YouAreNotAdmin/YouAreNotAdmin';
import { AsyncAlertExceptionHelper } from '@/utils/AlertExceptionHelper';
import AppManagerTableView from '@/components/AppManagerTableView/AppManagerTableView';

export default function ManagerItemsPage() {
  const route = useRouter();
  const [modal, setModal] = useState(<></>);
  const [isAdmin, setIsAdmin] = useState(true);
  const [brands, setBrands] = useState([
    {
      dp_id: 0,
      dp_name: '',
      dp_photoUrl: '',
      dp_urlSegment: '',
      dp_sortingIndex: 0,
      dp_seoKeywords: '',
      dp_seoDescription: '',
      dp_isHidden: false,
    },
  ]);

  useEffect(() => {
    (async function () {
      try {
        const isAdmin = await FetchUsers.isAdmin();

        if (!isAdmin) {
          setIsAdmin(false);
          return;
        }

        setIsAdmin(true);

        const itemBrands = (await FetchItemBrand.get()).sort(
          (a, b) => a.dp_sortingIndex - b.dp_sortingIndex,
        );
        setBrands(itemBrands);
      } catch (exception) {
        await AsyncAlertExceptionHelper(exception);
      }
    })();
  }, []);

  function preToDelete(id: number) {
    setModal(
      <AppModal
        title="Удаление элемента"
        message={`Вы уверены, что хотите удалить эелемент под id = ${id}?`}>
        <button onClick={() => toDelete(id)}>Удалить</button>
        <button onClick={() => setModal(<></>)}>Не удалять</button>
      </AppModal>,
    );
  }

  async function toDelete(id: number) {
    try {
      setModal(<></>);

      await FetchItemBrand.remove(id);

      const itemBrands = (await FetchItemBrand.get()).sort(
        (a, b) => a.dp_sortingIndex - b.dp_sortingIndex,
      );
      setBrands(itemBrands);
    } catch (exception) {
      await AsyncAlertExceptionHelper(exception);
    }
  }

  if (!isAdmin) {
    return <YouAreNotAdmin />;
  }

  return (
    <AppManagerTableView
      side={
        <>
          <button onClick={() => route.push('/manager/item-brands/new/create')}>
            Создать новый
          </button>
        </>
      }>
      {modal}
      <table>
        <thead>
          <tr>
            <td>id</td>
            <td>
              Индекс для
              <br />
              cортировки
            </td>
            <td>Картинка</td>
            <td>Наименование</td>
            <td>URL</td>
            <td>Обновить</td>
            <td>Удалить</td>
          </tr>
        </thead>
        <tbody>
          {brands.map(e => {
            return (
              <tr key={e.dp_id}>
                <td>{e.dp_id}</td>
                <td>{e.dp_sortingIndex}</td>
                <td>
                  {!e.dp_photoUrl ? (
                    'нет'
                  ) : (
                    <Image src={e.dp_photoUrl} alt="x" width={64} height={32} />
                  )}
                </td>
                <td>{e.dp_name}</td>
                <td>{e.dp_urlSegment}</td>
                <td>
                  <Link href={`/manager/item-brands/${e.dp_id}`}>Обновить</Link>
                </td>
                <td onClick={() => preToDelete(e.dp_id)}>удалить</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </AppManagerTableView>
  );
}
