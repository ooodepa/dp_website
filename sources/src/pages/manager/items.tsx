import * as xlsx from 'xlsx';
import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState } from 'react';

import styles from '@/styles/ManagerItemsPage.module.css';
import FetchUsers from '@/utils/FetchBackend/rest/api/users';
import FetchItems from '@/utils/FetchBackend/rest/api/items';
import ItemDto from '@/utils/FetchBackend/rest/api/items/dto/ItemDto';
import YouAreNotAdmin from '@/components/YouAreNotAdmin/YouAreNotAdmin';
import FetchItemCharacteristics from '@/utils/FetchBackend/rest/api/item-characteristics';
import BrowserDownloadFileController from '@/package/BrowserDownloadFileController';

export default function ManagerItemsPage() {
  const [isAdmin, setIsAdmin] = useState(true);
  const [sortType, setSortType] = useState('');
  const [isReverseSort, setIsReverseSort] = useState(false);
  const [filterCategoryId, setFilterCategoryId] = useState(0);
  const [filterModel, setFilterModel] = useState('');
  const [filterName, setFilterName] = useState('');
  const [items, setItems] = useState([
    {
      dp_id: '',
      dp_name: '',
      dp_model: '',
      dp_cost: 0,
      dp_photoUrl: '',
      dp_seoKeywords: '',
      dp_seoDescription: '',
      dp_itemCategoryId: 0,
      dp_isHidden: '',
      dp_itemCharacteristics: [
        {
          dp_id: 0,
          dp_itemId: '',
          dp_characteristicId: 0,
          dp_value: '',
        },
      ],
      dp_itemGalery: [
        {
          dp_id: 0,
          dp_itemId: '',
          dp_photoUrl: '',
        },
      ],
    },
  ]);

  useEffect(() => {
    (async function () {
      const isAdmin = await FetchUsers.isAdmin();

      if (!isAdmin) {
        setIsAdmin(false);
        return;
      }

      setIsAdmin(true);

      const itemsJson = await FetchItems.get();
      setItems(itemsJson);
      localStorage.setItem('DP_CTL_Items', JSON.stringify(itemsJson));
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const originalText = localStorage.getItem('DP_CTL_Items') || '[]';
    const original: ItemDto[] = JSON.parse(originalText);
    let filteredItems = original;

    if (filterCategoryId !== 0) {
      filteredItems = filteredItems.filter(
        e => e.dp_itemCategoryId === filterCategoryId,
      );
    }

    if (filterModel.length !== 0) {
      filteredItems = filteredItems.filter(e =>
        checkMatch(filterModel, e.dp_model),
      );
    }

    if (filterName.length !== 0) {
      filteredItems = filteredItems.filter(e =>
        checkMatch(filterName, e.dp_name),
      );
    }

    setItems(filteredItems);
  }, [filterCategoryId, filterModel, filterName]);

  useEffect(() => {
    if (!isReverseSort && sortType === 'name') {
      setItems([...items].sort((a, b) => a.dp_name.localeCompare(b.dp_name)));
      return;
    }

    if (isReverseSort && sortType === 'name') {
      setItems([...items].sort((a, b) => b.dp_name.localeCompare(a.dp_name)));
      return;
    }

    if (!isReverseSort && sortType === 'model') {
      setItems([...items].sort((a, b) => a.dp_model.localeCompare(b.dp_model)));
      return;
    }

    if (isReverseSort && sortType === 'model') {
      setItems([...items].sort((a, b) => b.dp_model.localeCompare(a.dp_model)));
      return;
    }

    if (!isReverseSort && sortType === 'categoryId') {
      setItems(
        [...items].sort((a, b) => a.dp_itemCategoryId - b.dp_itemCategoryId),
      );
      return;
    }

    if (isReverseSort && sortType === 'categoryId') {
      setItems(
        [...items].sort((a, b) => b.dp_itemCategoryId - a.dp_itemCategoryId),
      );
      return;
    }

    if (!isReverseSort && sortType === 'cost') {
      setItems([...items].sort((a, b) => a.dp_cost - b.dp_cost));
      return;
    }

    if (isReverseSort && sortType === 'cost') {
      setItems([...items].sort((a, b) => b.dp_cost - a.dp_cost));
      return;
    }
  }, [isReverseSort, items, sortType]);

  function checkMatch(search: string, text: string): boolean {
    const regex = new RegExp(`.*${search}.*`);
    return regex.test(text);
  }

  function saveAsJson() {
    const filename = 'DP_CTL_Items.json';
    const text = JSON.stringify(items, null, 2);
    BrowserDownloadFileController.downloadFile(filename, text);
  }

  function removeFilters() {
    setFilterCategoryId(0);
    setFilterModel('');
    setFilterName('');
  }

  async function saveItemsAsXlsx() {
    const characteristics = await FetchItemCharacteristics.get();

    const headers = [
      'id',
      'Наименование',
      'Модель',
      'Цена',
      'Картинка',
      'Ключевые слова',
      'Описание',
      'Код категории',
      'Скрыт',
      'Галерея',
      ...characteristics.map(e => e.dp_name),
    ];

    const setCategoriesId: Set<number> = new Set();
    items.forEach(e => {
      setCategoriesId.add(e.dp_itemCategoryId);
    });

    const arrayCategoriesId = Array.from(setCategoriesId).sort((a, b) => a - b);

    const workbook = xlsx.utils.book_new();
    for (let i = 0; i < arrayCategoriesId.length; ++i) {
      const categoryId = arrayCategoriesId[i];

      const arr = items
        .filter(item => item.dp_itemCategoryId === categoryId)
        .sort((a, b) => a.dp_model.localeCompare(b.dp_model));

      const data: string[][] = [];

      for (let j = 0; j < arr.length; ++j) {
        const item = arr[j];
        data.push([
          item.dp_id,
          item.dp_name,
          item.dp_model,
          `${item.dp_cost}`,
          item.dp_photoUrl,
          item.dp_seoKeywords,
          item.dp_seoDescription,
          `${item.dp_itemCategoryId}`,
          item.dp_isHidden === '0' ? '0' : '1',
          item.dp_itemGalery.map(e => e.dp_photoUrl).join(' '),
          ...characteristics.map(
            e =>
              item.dp_itemCharacteristics.find(
                j => e.dp_id === j.dp_characteristicId,
              )?.dp_value || '',
          ),
        ]);
      }

      const worksheet = xlsx.utils.aoa_to_sheet([headers, ...data]);
      xlsx.utils.book_append_sheet(workbook, worksheet, `${categoryId}`);
    }

    const excelBuffer = xlsx.write(workbook, {
      bookType: 'xlsx',
      type: 'array',
    });

    const filename = 'DP_CTL_Items.xlsx';
    const blob = new Blob([excelBuffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });
    BrowserDownloadFileController.downloadFileByBlob(filename, blob);
  }

  if (!isAdmin) {
    return <YouAreNotAdmin />;
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.table_block}>
        <table>
          <thead>
            <tr>
              <td>Картинка</td>
              <td>Модель</td>
              <td>Наименование</td>
              <td>Код категории</td>
              <td>Цена</td>
              <td>edit</td>
            </tr>
          </thead>
          <tbody>
            {items.map(e => {
              return (
                <tr key={e.dp_id}>
                  <td>
                    {!e.dp_photoUrl ? (
                      'нет'
                    ) : (
                      <Image
                        src={e.dp_photoUrl}
                        alt="x"
                        width={64}
                        height={32}
                      />
                    )}
                  </td>
                  <td>{e.dp_model}</td>
                  <td>{e.dp_name}</td>
                  <td>{e.dp_itemCategoryId}</td>
                  <td>{Number(e.dp_cost).toFixed(2)}</td>
                  <td>
                    <Link href={`/manager/items/${e.dp_id}`}>edit</Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <div className={styles.filters_block}>
        <button onClick={saveAsJson}>Скачать как JSON</button>
        <button onClick={saveItemsAsXlsx}> XLSX</button>

        <p>
          Фильтр: <button onClick={removeFilters}>убрать</button>
        </p>
        <ul>
          <li>
            <label htmlFor="filterCategoryId">Код категории</label>
            <input
              id="filterCategoryId"
              type="number"
              value={filterCategoryId}
              onChange={event =>
                setFilterCategoryId(Number(event.target.value))
              }
              min={0}
            />
          </li>
          <li>
            <label htmlFor="filterModel">Модель</label>
            <input
              id="filterModel"
              type="text"
              value={filterModel}
              onChange={event => setFilterModel(event.target.value)}
            />
          </li>
          <li>
            <label htmlFor="filterName">Наименование</label>
            <input
              id="filterName"
              type="text"
              value={filterName}
              onChange={event => setFilterName(event.target.value)}
            />
          </li>

          <li>
            <label>
              Сортировка:
              <input
                type="checkbox"
                checked={isReverseSort}
                onChange={() => setIsReverseSort(!isReverseSort)}
              />
              Обратная
            </label>

            <ul>
              <li>
                <input
                  type="radio"
                  name="sort"
                  onChange={() => setSortType('model')}
                />
                Модель
              </li>
              <li>
                <input
                  type="radio"
                  name="sort"
                  onChange={() => setSortType('name')}
                />
                Наименование
              </li>
              <li>
                <input
                  type="radio"
                  name="sort"
                  onChange={() => setSortType('categoryId')}
                />
                Код категори
              </li>
              <li>
                <input
                  type="radio"
                  name="sort"
                  onChange={() => setSortType('cost')}
                />
                Цена
              </li>
            </ul>
          </li>
        </ul>
      </div>
    </div>
  );
}
