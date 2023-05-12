import {
  ChangeEvent,
  InputHTMLAttributes,
  SyntheticEvent,
  TextareaHTMLAttributes,
  useEffect,
  useState,
} from 'react';
import Image from 'next/image';
import { useRouter } from 'next/router';

import AppModal from '@/components/AppModal/AppModal';
import FetchUsers from '@/utils/FetchBackend/rest/api/users';
import styles from '@/styles/ManagerItemEditorPage.module.css';
import HttpException from '@/utils/FetchBackend/HttpException';
import AppContainer from '@/components/AppContainer/AppContainer';
import FetchItemBrand from '@/utils/FetchBackend/rest/api/item-brands';
import YouAreNotAdmin from '@/components/YouAreNotAdmin/YouAreNotAdmin';
import { AsyncAlertExceptionHelper } from '@/utils/AlertExceptionHelper';

export default function ManagerItemBrandUpdatePage() {
  const route = useRouter();
  const { id } = route.query;
  const [modal, setModal] = useState(<></>);
  const [isAdmin, setIsAdmin] = useState(true);
  const [is404, setIs404] = useState(false);
  const [original, setOriginal] = useState({
    dp_id: 0,
    dp_name: '',
    dp_photoUrl: '',
    dp_urlSegment: '',
    dp_sortingIndex: 0,
    dp_seoKeywords: '',
    dp_seoDescription: '',
    dp_isHidden: false,
  });
  const [data, setData] = useState({
    dp_id: 0,
    dp_name: '',
    dp_photoUrl: '',
    dp_urlSegment: '',
    dp_sortingIndex: 0,
    dp_seoKeywords: '',
    dp_seoDescription: '',
    dp_isHidden: false,
  });

  useEffect(() => {
    const dp_id: number = Number(route?.query?.id);

    if (!dp_id) {
      setIs404(true);
      return;
    }

    (async function () {
      try {
        const isAdmin = await FetchUsers.isAdmin();

        if (!isAdmin) {
          setIsAdmin(false);
          return;
        }

        setIsAdmin(true);

        const brand = await FetchItemBrand.getById(dp_id);
        setData(brand);
        setOriginal(brand);
        setIs404(false);
      } catch (exception) {
        if (exception instanceof HttpException) {
          if (exception.HTTP_STATUS === 404) {
            setIs404(true);
            return;
          }
        }

        await AsyncAlertExceptionHelper(exception);
      }
    })();
  }, [route.query?.id]);

  function handleOnChange(e: ChangeEvent<HTMLInputElement>) {
    const { name } = e.target;

    if (name === 'dp_isHidden') {
      const { checked } = e.target;
      setData(prev => ({ ...prev, [name]: !checked }));
      return;
    }

    const { value } = e.target;

    if (name === 'dp_sortingIndex') {
      setData(prev => ({ ...prev, [name]: Number(value) }));
      return;
    }

    setData(prev => ({ ...prev, [name]: value }));
  }

  function handleOnSubmit(event: SyntheticEvent) {
    event.preventDefault();

    setModal(
      <AppModal
        title="Сохранение элемента"
        message="Вы уверены, что хотите сохранить это">
        <button onClick={save}>Сохранить</button>
        <button onClick={() => setModal(<></>)}>Не сохранять</button>
      </AppModal>,
    );
  }

  async function save() {
    try {
      setModal(<></>);

      if (JSON.stringify(original) === JSON.stringify(data)) {
        setModal(
          <AppModal
            title="Сохранение элемента"
            message="Вы не редактировали элемент. Нет того, что сохранить">
            <button onClick={() => setModal(<></>)}>Закрыть</button>
          </AppModal>,
        );
        return;
      }

      await FetchItemBrand.update(data.dp_id, data);
      route.push('/manager/item-brands');
    } catch (exception) {
      await AsyncAlertExceptionHelper(exception);
    }
  }

  function toListPage() {
    if (JSON.stringify(original) === JSON.stringify(data)) {
      route.push('/manager/item-brands');
      return;
    }

    setModal(
      <AppModal
        title="Сохранение элемента"
        message="Вы отредактировали элемент, но не сохранили.">
        <button onClick={() => setModal(<></>)}>Вернуться к форме</button>
        <button onClick={() => route.push('/manager/item-brands')}>
          Не сохранять
        </button>
      </AppModal>,
    );
  }

  if (is404) {
    return <p>Нет такого бренда в БД (dp_id={id})</p>;
  }

  if (!isAdmin) {
    return <YouAreNotAdmin />;
  }

  return (
    <AppContainer>
      {modal}
      <h2>Редактор бренда</h2>
      <div className={styles.specialButtons}>
        <button className={styles.form__button} onClick={toListPage}>
          Вернуться к списку
        </button>
      </div>
      <form onSubmit={handleOnSubmit} className={styles.form}>
        <table className={styles.table}>
          <tbody>
            <tr>
              <td>ID</td>
              <td>{data.dp_id}</td>
            </tr>
            <tr>
              <td>Наименование</td>
              <td>
                <MyInput
                  type="text"
                  onChange={handleOnChange}
                  name="dp_name"
                  value={data.dp_name}
                />
              </td>
            </tr>
            <tr>
              <td>URL сегмент</td>
              <td>
                <MyInput
                  type="text"
                  onChange={handleOnChange}
                  name="dp_urlSegment"
                  value={data.dp_urlSegment}
                />
              </td>
            </tr>
            <tr>
              <td>
                Индекс <br /> для сортировки
              </td>
              <td>
                <MyInput
                  type="number"
                  onChange={handleOnChange}
                  name="dp_sortingIndex"
                  value={data.dp_sortingIndex}
                  min="0"
                />
              </td>
            </tr>
            <tr>
              <td>Скрыт</td>
              <td>
                <MyInput
                  id="isCheked"
                  type="checkbox"
                  name="dp_isHidden"
                  checked={!data.dp_isHidden}
                  onChange={handleOnChange}
                />
              </td>
            </tr>
            <tr>
              <td>Картинка</td>
              <td>
                <MyInput
                  type="text"
                  onChange={handleOnChange}
                  name="dp_photoUrl"
                  value={data.dp_photoUrl}
                />
              </td>
            </tr>
            <tr>
              <td></td>
              <td>
                {!data.dp_photoUrl.length ? (
                  'не указано изображение'
                ) : (
                  <Image
                    src={data.dp_photoUrl}
                    alt="не рабочая ссылка"
                    width={100}
                    height={50}
                  />
                )}
              </td>
            </tr>
            <tr>
              <td>Описание</td>
              <td>
                <MyTextArea
                  onChange={handleOnChange}
                  name="dp_seoDescription"
                  value={data.dp_seoDescription}
                />
              </td>
            </tr>
            <tr>
              <td>Ключевые слова</td>
              <td>
                <MyTextArea
                  onChange={handleOnChange}
                  name="dp_seoKeywords"
                  value={data.dp_seoKeywords}
                />
              </td>
            </tr>
          </tbody>
        </table>
        <button type="submit" className={styles.form__button}>
          Сохранить
        </button>
      </form>
    </AppContainer>
  );
}

function MyInput(props: InputHTMLAttributes<any>) {
  return (
    <>
      {props.type !== 'checkbox' ? null : (
        <label
          htmlFor={props.id}
          className={styles.form__checkbox}
          custom-is-cheked={props.checked ? '0' : '1'}></label>
      )}
      <input className={styles.form__input} {...props} />
    </>
  );
}

function MyTextArea(props: TextareaHTMLAttributes<any>) {
  return (
    <textarea
      className={styles.form__textarea}
      name={props.name}
      onChange={props.onChange}
      value={props.value}
    />
  );
}
