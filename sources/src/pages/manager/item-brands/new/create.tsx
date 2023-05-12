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
import AppContainer from '@/components/AppContainer/AppContainer';
import YouAreNotAdmin from '@/components/YouAreNotAdmin/YouAreNotAdmin';
import FetchItemBrand from '@/utils/FetchBackend/rest/api/item-brands';
import toModalHttpException from '@/utils/FetchBackend/toModalHttpException';
import toModalHttpResponse from '@/utils/FetchBackend/toModalHttpResponseDto';
import RefreshTokenNotFoundException from '@/utils/FetchBackend/RefreshTokenNotFoundException';

export default function ManagerItemEditorPage() {
  const route = useRouter();
  const [modal, setModal] = useState(<></>);
  const [isAdmin, setIsAdmin] = useState(true);
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
    (async function () {
      try {
        const isAdmin = await FetchUsers.isAdmin();

        if (!isAdmin) {
          setIsAdmin(false);
          return;
        }

        setIsAdmin(true);
      } catch (exception) {}
    })();
  }, []);

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
        title="Добавление элемента"
        message="Вы уверены, что хотите добавить эту запись">
        <button onClick={create}>Добавить</button>
        <button onClick={() => setModal(<></>)}>Отмена</button>
      </AppModal>,
    );
  }

  async function create() {
    try {
      const httpResponseDto = await FetchItemBrand.create(data);
      route.push('/manager/item-brands');
    } catch (exception) {
      if (await toModalHttpException(exception, setModal)) {
        return;
      }
      if (exception instanceof RefreshTokenNotFoundException) {
        route.push('/manager');
        return;
      }
    }
  }

  if (!isAdmin) {
    return <YouAreNotAdmin />;
  }

  return (
    <AppContainer>
      {modal}
      <h2>Создание бренда</h2>
      <form onSubmit={handleOnSubmit} className={styles.form}>
        <table className={styles.table}>
          <tbody>
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
          Добавить
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
