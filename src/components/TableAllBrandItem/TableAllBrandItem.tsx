import { useEffect, useState } from 'react';

import { useRouter } from 'next/router';
import AppModal from '../AppModal/AppModal';
import BasketHelper from '@/utils/BasketHelper';
import styles from './TableAllBrandItem.module.css';
import AppContainer from '../AppContainer/AppContainer';
import FetchItems from '@/utils/FetchBackend/rest/api/items';
import FetchItemBrand from '@/utils/FetchBackend/rest/api/item-brands';
import { AsyncAlertExceptionHelper } from '@/utils/AlertExceptionHelper';
import ItemObject from '@/utils/FetchBackend/rest/api/items/dto/ItemObject';
import GetItemDto from '@/utils/FetchBackend/rest/api/items/dto/get-item.dto';
import FetchItemCategories from '@/utils/FetchBackend/rest/api/item-categories';
import GetItemBrandDto from '@/utils/FetchBackend/rest/api/item-brands/dto/get-item-brand.dto';
import EmptyGetItemBrand from '@/utils/FetchBackend/rest/api/item-brands/dto/empty-get-item.dto';
import GetItemCategoryDto from '@/utils/FetchBackend/rest/api/item-categories/dto/get-item-category.dto';

interface LangNames {
  EN?: string;
  RU?: string;
  TR?: string;
}

interface IText {
  tableName: LangNames;
  image: LangNames;
  model: LangNames;
  name: LangNames;
  onBox: LangNames;
  kg: LangNames;
  m3: LangNames;
  desiredCount: LangNames;
  specify: LangNames;
  USD: LangNames;
  BYN: LangNames;
  EUR: LangNames;
  RUB: LangNames;
  AMD: LangNames;
  GEL: LangNames;
}

const text: IText = {
  tableName: {
    EN: 'Table - Nomenclature for quick order',
    RU: 'Таблица - Номенклатура для быстрого заказа',
    TR: 'Tablo - Hızlı sipariş için isimlendirme',
  },
  image: {
    EN: 'Image',
    RU: 'Картинка',
    TR: 'Resim',
  },
  model: {
    EN: 'Code',
    RU: 'Модель',
    TR: 'Kod',
  },
  name: {
    EN: 'Name',
    RU: 'Наименование',
    TR: 'İsim',
  },
  onBox: {
    EN: 'In wholesale box',
    RU: 'В коробке оптом',
    TR: 'Toplu kutuda',
  },
  kg: {
    EN: 'Wholesale box weight',
    RU: 'Вес оптовой коробки',
    TR: 'Toptan kutu ağırlığı',
  },
  m3: {
    EN: 'Wholesale box volume',
    RU: 'Объем оптовой коробки',
    TR: 'Toplu kutu hacmi',
  },
  desiredCount: {
    EN: 'Desired quantity',
    RU: 'Желаемое количество',
    TR: 'İstenilen miktar',
  },
  specify: {
    EN: 'ask',
    RU: 'уточняйте',
    TR: 'sormak',
  },
  USD: {
    EN: 'Wholesale price for 1 unit in Istanbul in US dollars',
    RU: 'Оптовая цена 1 единицы в Стамбуле в доларах США',
    TR: "İstanbul'da bir birimin toptan fiyatı, Amerikan doları cinsindendir",
  },
  BYN: {
    EN: 'Wholesale price for 1 unit in Belarus with delivery including VAT in Belarusian rubles',
    RU: 'Оптовая цена 1 единицы в Беларуси с доставкой с НДС в белорусских рублях',
    TR: "Belarus'ta bir birimin toptan fiyatı, Belarus rubleleri üzerinden KDV dahil teslimatla birlikte",
  },
  EUR: {
    EN: 'Wholesale price for 1 unit in Istanbul in euros',
    RU: 'Оптовая цена 1 единицы в Стамбуле в евро',
    TR: "İstanbul'da bir birimin toptan fiyatı, euro cinsindendir",
  },
  RUB: {
    EN: 'Wholesale price for 1 unit in Russia with delivery including VAT in Russian rubles',
    RU: 'Оптовая цена 1 единицы в России с доставкой с НДС в российских рублях',
    TR: "Rusya'da bir birimin toptan fiyatı, Rus rubleleri üzerinden KDV dahil teslimatla birlikte",
  },
  AMD: {
    EN: 'Wholesale price for 1 unit in Armenia with delivery including VAT in Armenian drams',
    RU: 'Оптовая цена 1 единицы в Армении с доставкой с НДС в армянских драмах',
    TR: "Ermenistan'da bir birimin toptan fiyatı, Ermeni dramı cinsindendir ve KDV dahil teslimatla birlikte",
  },
  GEL: {
    EN: 'Wholesale price for 1 unit in Georgia with delivery including VAT in Georgian lari',
    RU: 'Оптовая цена 1 единицы в Грузии с доставкой с НДС в грузинских лари',
    TR: "Gürcistan'da bir birimin toptan fiyatı, Gürcü lari cinsindendir ve KDV dahil teslimatla birlikte",
  },
};

const LANGS: Array<'RU' | 'EN' | 'TR'> = ['RU', 'EN', 'TR'];
const MONEY: Array<'BYN' | 'USD' | 'RUB' | 'AMD' | 'GEL'> = [
  'BYN',
  'USD',
  'RUB',
  'AMD',
  'GEL',
];

interface IItems {
  model: string;
  name: string;
  cost: string;
  photoUrl: string;
  onBox: string;
  m3: string;
  kg: string;
  categoryId: number;
  id: string;
}

export default function TableAllBrandItem() {
  const route = useRouter();
  const { brand } = route.query;
  const [itemBrandData, setItemBrandData] =
    useState<GetItemBrandDto>(EmptyGetItemBrand);
  const [itemCategoryArray, setItemCategoryArray] = useState<
    GetItemCategoryDto[]
  >([]);
  const [itemArray, setItemArray] = useState<GetItemDto[]>([]);

  const [language, setLanguage] = useState<'RU' | 'EN' | 'TR'>('RU');
  const [money, setMoney] = useState<'BYN' | 'USD' | 'RUB' | 'AMD' | 'GEL'>(
    'BYN',
  );
  const [itemArr, setItemArr] = useState<IItems[]>([]);
  const [isOpenedSelectLang, setIsOpenedSelectLang] = useState<boolean>(false);
  const [isOpenedSelectMoney, setIsOpenedSelectMoney] =
    useState<boolean>(false);
  const [procentLoader, setProcentLoader] = useState<number>(0);
  const [loaderStatus, setLoaderStatus] = useState<string>(
    'Загрузка данных из БД',
  );

  useEffect(() => {
    (async function () {
      try {
        if (!brand) {
          return;
        }

        setProcentLoader(0);
        setLoaderStatus('Выгрузка бренда из базы данных');

        const TEMP_ITEM_BRAND = await FetchItemBrand.filterOneByUrl(`${brand}`);
        setItemBrandData(TEMP_ITEM_BRAND);
        setProcentLoader(25);
        setLoaderStatus('Выгрузка категорий номенклатуры из базы данных');

        const TEMP_ITEM_CATEGORIES = await FetchItemCategories.filterByBrand(
          `${brand}`,
        );
        setItemCategoryArray(TEMP_ITEM_CATEGORIES);
        setProcentLoader(50);
        setLoaderStatus('Выгрузка номенклатуры из базы данных');

        const TEMP_ITEMS = await FetchItems.getByBrand(`${brand}`);
        setItemArray(TEMP_ITEMS);
        setProcentLoader(75);
        setLoaderStatus(
          'Создание собственого массива номенклатуры данного бренда',
        );

        setItemArr(getNewTable(TEMP_ITEM_CATEGORIES, TEMP_ITEMS));
        setProcentLoader(100);
      } catch (exception) {
        await AsyncAlertExceptionHelper(exception);
        setItemBrandData(EmptyGetItemBrand);
        setItemCategoryArray([]);
        setItemArray([]);
        setLoaderStatus('' + exception);
      }
    })();
  }, [brand]);

  useEffect(() => {
    setItemArr(getNewTable(itemCategoryArray, itemArray));
  }, [language, money]);

  function getNewTable(categories: GetItemCategoryDto[], items: GetItemDto[]) {
    const result: IItems[] = [];
    for (let i = 0; i < categories.length; ++i) {
      const currentCategory = categories[i];

      if (currentCategory.dp_isHidden) continue;

      for (let j = 0; j < items.length; ++j) {
        const currentItem = items[j];

        if (currentItem.dp_isHidden) continue;

        if (currentCategory.dp_id === currentItem.dp_itemCategoryId) {
          // < < < < < < < < name
          const nameRU = ItemObject.getNameRU(currentItem);
          let name =
            language === 'RU'
              ? nameRU
              : language === 'EN'
              ? ItemObject.getNameEN(currentItem)
              : language === 'TR'
              ? ItemObject.getNameTR(currentItem)
              : nameRU;
          name = name.length === 0 ? currentItem.dp_seoTitle : name;
          // > > > > > > > > end name
          // < < < < < < < < cost
          const costBYN = Number(ItemObject.getCostBYN(currentItem)).toFixed(2);
          const cost =
            money === 'BYN'
              ? costBYN
              : money === 'RUB'
              ? Number(ItemObject.getCostRUB(currentItem)).toFixed(2)
              : money === 'USD'
              ? Number(ItemObject.getCostUSD(currentItem)).toFixed(2)
              : money === 'AMD'
              ? Number(ItemObject.getCostAMD(currentItem)).toFixed(2)
              : money === 'GEL'
              ? Number(ItemObject.getCostGEL(currentItem)).toFixed(2)
              : '0.00';
          // > > > > > > > > end cost
          const model = currentItem.dp_seoUrlSegment;
          const onBox = ItemObject.getOnBox(currentItem);
          const kg = ItemObject.getKg(currentItem);
          const m3 = ItemObject.getm3(currentItem);
          result.push({
            model,
            cost,
            name,
            onBox,
            kg,
            m3,
            photoUrl: currentItem.dp_photoUrl,
            categoryId: currentItem.dp_itemCategoryId,
            id: currentItem.dp_id,
          });
        }
      }
    }
    return result;
  }

  if (procentLoader !== 100) {
    return (
      <AppContainer>
        <h2>{itemBrandData.dp_seoTitle}</h2>
        <div className={styles.loader_block}>
          <div className={styles.loader}></div>
        </div>
        <p style={{ textAlign: 'center' }}>{loaderStatus}</p>
        <p style={{ textAlign: 'center' }}>
          {Number(procentLoader).toFixed(2)} %
        </p>
      </AppContainer>
    );
  }

  let costName = '';
  switch (money) {
    case 'BYN':
      costName = text.BYN[language] || text.BYN['RU'] || '';
      break;
    case 'USD':
      costName = text.USD[language] || text.USD['RU'] || '';
      break;
    case 'RUB':
      costName = text.RUB[language] || text.RUB['RU'] || '';
      break;
    case 'AMD':
      costName = text.AMD[language] || text.AMD['RU'] || '';
      break;
    case 'GEL':
      costName = text.GEL[language] || text.GEL['RU'] || '';
      break;
  }

  return (
    <AppContainer>
      <div className={styles.wrapper}>
        <div className={styles.title_block}>
          <span>{text.tableName[language] || text.tableName['RU']} </span>
          <button onClick={() => window.location.replace('/basket')}>
            Корзина
          </button>
          <button onClick={() => setIsOpenedSelectLang(true)}>
            {language} ▼
          </button>
          {isOpenedSelectLang ? (
            <AppModal title="Выберите язык" message="">
              {LANGS.map(e => {
                return (
                  <button
                    key={e}
                    onClick={() => {
                      setLanguage(e);
                      setIsOpenedSelectLang(false);
                    }}>
                    {e}
                  </button>
                );
              })}
              <button onClick={() => setIsOpenedSelectLang(false)}>X</button>
            </AppModal>
          ) : null}
          <button onClick={() => setIsOpenedSelectMoney(true)}>
            {money} ▼
          </button>
          {isOpenedSelectMoney ? (
            <AppModal title="Выберите тип валюты" message="">
              {MONEY.map(e => {
                return (
                  <button
                    key={e}
                    onClick={() => {
                      setMoney(e);
                      setIsOpenedSelectMoney(false);
                    }}>
                    {e}
                  </button>
                );
              })}
              <button onClick={() => setIsOpenedSelectMoney(false)}>X</button>
            </AppModal>
          ) : null}
        </div>
        <table>
          <thead>
            <tr>
              <th>{text.image[language] || text.image['RU']}</th>
              <th>{text.model[language] || text.model['RU']}</th>
              <th>{text.name[language] || text.name['RU']}</th>
              <th>{costName}</th>
              <th>{text.onBox[language] || text.onBox['RU']}</th>
              <th>{text.kg[language] || text.kg['RU']}</th>
              <th>{text.m3[language] || text.m3['RU']}</th>
              <th>{text.desiredCount[language] || text.desiredCount['RU']}</th>
            </tr>
          </thead>
          <tbody>
            {itemCategoryArray.map(category => {
              if (category.dp_isHidden) return null;
              return (
                <>
                  <tr key={category.dp_id}>
                    <td colSpan={8} className={styles.td_category}>
                      {category.dp_seoTitle}
                    </td>
                  </tr>
                  {itemArr.map(item => {
                    if (item.categoryId === category.dp_id) {
                      return (
                        <tr key={`${item.id} ${item.name} ${item.cost}`}>
                          <td className={styles.td_img}>
                            <img src={item.photoUrl} alt="no img" />
                          </td>
                          <td>{item.model}</td>
                          <td className={styles.td_name}>{item.name}</td>
                          <td className={styles.td_cost}>
                            {item.cost === '0.00' ? (
                              <span style={{ color: 'lightgrey' }}>
                                {text.specify[language] || text.specify['RU']}
                              </span>
                            ) : (
                              `${item.cost} ${money}`
                            )}
                          </td>
                          <td className={styles.td_right}>{item.onBox}</td>
                          <td className={styles.td_right}>{item.kg}</td>
                          <td className={styles.td_right}>{item.m3}</td>
                          <td>
                            <input
                              type="number"
                              defaultValue={BasketHelper.getCount(item.model)}
                              onChange={event =>
                                BasketHelper.setCount(
                                  item.model,
                                  Number(event.target.value),
                                )
                              }
                            />
                          </td>
                        </tr>
                      );
                    }
                    return null;
                  })}
                </>
              );
            })}
          </tbody>
        </table>
      </div>
    </AppContainer>
  );
}
