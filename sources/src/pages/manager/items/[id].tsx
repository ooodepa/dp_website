import Image from 'next/image';
import { useRouter } from 'next/router';
import {
  ChangeEvent,
  InputHTMLAttributes,
  SyntheticEvent,
  TextareaHTMLAttributes,
  useEffect,
  useState,
} from 'react';

import AppModal from '@/components/AppModal/AppModal';
import FetchItems from '@/utils/FetchBackend/rest/api/items';
import FetchUsers from '@/utils/FetchBackend/rest/api/users';
import styles from '@/styles/ManagerItemEditorPage.module.css';
import HttpException from '@/utils/FetchBackend/HttpException';
import AppContainer from '@/components/AppContainer/AppContainer';
import YouAreNotAdmin from '@/components/YouAreNotAdmin/YouAreNotAdmin';
import UpdateItemDto from '@/utils/FetchBackend/rest/api/items/dto/update-item.dto';
import BrowserDownloadFileController from '@/package/BrowserDownloadFileController';
import FetchItemCharacteristics from '@/utils/FetchBackend/rest/api/item-characteristics';

export default function ManagerItemEditorPage() {
  const route = useRouter();
  const { id } = route.query;
  const [modal, setModal] = useState(<></>);
  const [isAdmin, setIsAdmin] = useState(true);
  const [is404, setIs404] = useState(false);
  const [itemCharacteristics, setItemCharacteristics] = useState([
    {
      dp_id: 0,
      dp_name: '',
    },
  ]);
  const [original, setOriginal] = useState({
    dp_id: '',
    dp_name: '',
    dp_model: '',
    dp_cost: 0,
    dp_photoUrl: '',
    dp_seoKeywords: '',
    dp_seoDescription: '',
    dp_itemCategoryId: 0,
    dp_isHidden: false,
    dp_itemCharacteristics: [
      {
        dp_characteristicId: 0,
        dp_value: '',
      },
    ],
    dp_itemGalery: [{ dp_photoUrl: '' }],
  });
  const [data, setData] = useState({
    dp_id: '',
    dp_name: '',
    dp_model: '',
    dp_cost: 0,
    dp_photoUrl: '',
    dp_seoKeywords: '',
    dp_seoDescription: '',
    dp_itemCategoryId: 0,
    dp_isHidden: false,
    dp_itemCharacteristics: [
      {
        dp_characteristicId: 0,
        dp_value: '',
      },
    ],
    dp_itemGalery: [{ dp_photoUrl: '' }],
  });

  useEffect(() => {
    if (!route.query?.id) {
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

        const dp_id: string = route?.query?.id as string;

        if (!dp_id) {
          return;
        }

        const item = await FetchItems.getById(dp_id);
        const DATA = {
          dp_id: item.dp_id,
          dp_name: item.dp_name,
          dp_model: item.dp_model,
          dp_cost: item.dp_cost,
          dp_photoUrl: item.dp_photoUrl,
          dp_seoKeywords: item.dp_seoDescription,
          dp_seoDescription: item.dp_seoDescription,
          dp_itemCategoryId: item.dp_itemCategoryId,
          dp_isHidden: item.dp_isHidden !== '0',
          dp_itemCharacteristics: item.dp_itemCharacteristics.map(e => ({
            dp_characteristicId: e.dp_characteristicId,
            dp_value: e.dp_value,
          })),
          dp_itemGalery: item.dp_itemGalery,
        };
        setData(DATA);
        setOriginal(DATA);
        setIs404(false);
      } catch (exception) {
        if (exception instanceof HttpException) {
          if (exception.HTTP_STATUS === 404) {
            setIs404(true);
          }
        }
      }

      try {
        setItemCharacteristics(await FetchItemCharacteristics.get());
      } catch (exception) {
        alert(exception);
      }
    })();
  }, [route.query?.id]);

  function handleOnChange(e: ChangeEvent<HTMLInputElement>) {
    const { name } = e.target;

    if (name === 'dp_isHidden') {
      const { checked } = e.target;
      setData(prev => ({ ...prev, dp_isHidden: !checked }));
      return;
    }

    const { value } = e.target;

    let arr = [...data.dp_itemCharacteristics];
    if (/^dp_itemCharacteristics\[\d+\]$/.test(name)) {
      const characteristicId: number = Number(
        name.replace('dp_itemCharacteristics[', '').replace(']', ''),
      );
      let isAdded = false;
      for (let i = 0; i < arr.length; ++i) {
        if (arr[i].dp_characteristicId === characteristicId) {
          arr[i].dp_value = value;
          isAdded = true;
          break;
        }
      }

      if (!isAdded) {
        arr.push({ dp_characteristicId: characteristicId, dp_value: value });
      }

      setData(prev => ({
        ...prev,
        dp_itemCharacteristics: arr.filter(e => e.dp_value.length),
      }));

      return;
    }

    if (name === 'dp_itemGalery') {
      setData(prev => ({
        ...prev,
        dp_itemGalery: value
          .split(/\s+/)
          .map(e => ({ dp_photoUrl: e }))
          .filter(e => e.dp_photoUrl.length),
      }));
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

    route.push('/manager/items');
  }

  function saveAsJson() {
    const dp_id: string = route?.query?.id as string;
    const filename = `DP_CTL_Item__id=${dp_id}.json`;
    const itemData: UpdateItemDto = { ...data };
    const text = JSON.stringify(itemData, null, 2);
    BrowserDownloadFileController.downloadFile(filename, text);
  }

  if (is404) {
    return <p>Нет такой номенклатуры в БД с таким UUID (dp_id={id})</p>;
  }

  if (!isAdmin) {
    return <YouAreNotAdmin />;
  }

  return (
    <AppContainer>
      {modal}
      <h2>Редактор номенклатуры</h2>
      <div className={styles.specialButtons}>
        <button className={styles.form__button} onClick={saveAsJson}>
          Скачать как JSON
        </button>
      </div>
      <form onSubmit={handleOnSubmit} className={styles.form}>
        <table className={styles.table}>
          <tbody>
            <tr>
              <td colSpan={2}>Основные характеристики</td>
            </tr>
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
              <td>Модель</td>
              <td>
                <MyInput
                  type="text"
                  onChange={handleOnChange}
                  name="dp_model"
                  value={data.dp_model}
                />
              </td>
            </tr>
            <tr>
              <td>Цена</td>
              <td>
                <MyInput
                  type="number"
                  onChange={handleOnChange}
                  name="dp_cost"
                  value={data.dp_cost}
                  step="0.01"
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
              <td>Код категории</td>
              <td>
                <MyInput
                  type="number"
                  onChange={handleOnChange}
                  name="dp_itemCategoryId"
                  value={data.dp_itemCategoryId}
                  min="0"
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
            <tr>
              <td colSpan={2}>Табличная часть - Галерея</td>
            </tr>

            <tr>
              <td>
                Галерея <br />
                <span style={{ color: 'gray' }}>(через Enter)</span>
              </td>
              <td>
                <MyTextArea
                  onChange={handleOnChange}
                  name="dp_itemGalery"
                  value={data.dp_itemGalery.map(e => e.dp_photoUrl).join('\n')}
                />
              </td>
            </tr>
            <tr>
              <td></td>
              <td>
                {!data.dp_itemGalery.length ? 'галерея пуста' : null}
                {data.dp_itemGalery.map((e, index) => {
                  if (!e.dp_photoUrl.length) {
                    return <span key={index}>не указано изображение</span>;
                  }

                  return (
                    <Image
                      key={index}
                      src={e.dp_photoUrl}
                      alt="не рабочая ссылка"
                      width={100}
                      height={50}
                    />
                  );
                })}
              </td>
            </tr>
            <tr>
              <td colSpan={2}>
                Табличная часть - Дополнительные характеристики
              </td>
            </tr>
            {itemCharacteristics.map((e, index) => {
              const value =
                data.dp_itemCharacteristics.find(
                  ch => ch.dp_characteristicId === e.dp_id,
                )?.dp_value || '';

              return (
                <tr key={e.dp_id}>
                  <td>{e.dp_name}</td>
                  <td>
                    <MyInput
                      type="text"
                      onChange={handleOnChange}
                      name={`dp_itemCharacteristics[${e.dp_id}]`}
                      value={value}
                    />
                  </td>
                </tr>
              );
            })}
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
