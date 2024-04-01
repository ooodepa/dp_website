import Link from 'next/link';

import styles from './ItemCharacteristics.module.css';
import ItemDto from '@/utils/FetchBackend/rest/api/items/dto/item.dto';
import ItemObject from '@/utils/FetchBackend/rest/api/items/dto/ItemObject';
import ItemBrandDto from '@/utils/FetchBackend/rest/api/item-brands/dto/item-brand.dto';
import ItemCategoryDto from '@/utils/FetchBackend/rest/api/item-categories/dto/item-category.dto';
import GetItemCharacteristicDto from '@/utils/FetchBackend/rest/api/item-characteristics/dto/get-item-characteristic.dto';

interface IProps {
  itemBrand: ItemBrandDto;
  itemCategory: ItemCategoryDto;
  item: ItemDto;
  itemCharacteristics: GetItemCharacteristicDto[];
}

export default function ItemCharacteristics(props: IProps) {
  return (
    <>
      <ViewMainData
        item={props.item}
        itemCategory={props.itemCategory}
        itemBrand={props.itemBrand}
      />
      <ViewMainCost item={props.item} />
      <ViewCosts
        item={props.item}
        itemCharacteristics={props.itemCharacteristics}
      />
      <ViewOtherCharacteristics
        item={props.item}
        itemCharacteristics={props.itemCharacteristics}
      />
    </>
  );
}

interface IViewMainData {
  item: ItemDto;
  itemBrand: ItemBrandDto;
  itemCategory: ItemCategoryDto;
}

function ViewMainData(props: IViewMainData) {
  const urlSegmentBrand = props.itemBrand.dp_seoUrlSegment;
  const urlSegmentCategory = props.itemCategory.dp_seoUrlSegment;
  const urlSegmentModel = props.item.dp_seoUrlSegment;

  return (
    <div className={styles.wrapper}>
      <h3>Основные данные</h3>
      <table>
        <tbody>
          <tr>
            <td colSpan={2} style={{ textAlign: 'center' }}>
              Данные номенклатуры:
            </td>
          </tr>
          <tr>
            <td>Наименование</td>
            <td>{props.item.dp_seoTitle}</td>
          </tr>
          <tr>
            <td>Бренд</td>
            <td>
              {props.itemBrand.dp_seoTitle}
              <br />
              <Link
                href={`/products/${urlSegmentBrand}`}
                title="Перейти на страницу с номенлатурой этого бренда">
                ({urlSegmentBrand})
              </Link>
            </td>
          </tr>
          <tr>
            <td>Категория</td>
            <td>
              {props.itemCategory.dp_seoTitle}
              <br />
              <Link
                href={`/products/${urlSegmentBrand}/${urlSegmentCategory}`}
                title="Перейти на страницу с номенлатурой этой категории">
                ({urlSegmentCategory})
              </Link>
            </td>
          </tr>
          <tr>
            <td>Модель</td>
            <td>
              <Link
                href={`/products/${urlSegmentBrand}/${urlSegmentCategory}/${urlSegmentModel}`}
                title="Перейти на страницу с номенлатурой (вы уже на ней)">
                {urlSegmentModel}
              </Link>
            </td>
          </tr>
          {props.item.dp_1cCode ? (
            <tr>
              <td>Код 1С</td>
              <td>{props.item.dp_1cCode}</td>
            </tr>
          ) : null}
          {props.item.dp_1cDescription ? (
            <tr>
              <td>Наименование 1С</td>
              <td>{props.item.dp_1cDescription}</td>
            </tr>
          ) : null}
        </tbody>
      </table>
      <h3>Описание</h3>
      <div className={styles.description_block}>
        {props.item.dp_seoDescription}
      </div>
    </div>
  );
}

interface IViewMainCost {
  item: ItemDto;
}

function ViewMainCost(props: IViewMainCost) {
  const costBynNoNDS = Number(props.item.dp_cost).toFixed(2);
  const costBynNDS = Number(Number(costBynNoNDS) * 0.2).toFixed(2);
  const costBynWithNDS = Number(Number(costBynNoNDS) * 1.2).toFixed(2);

  return (
    <div className={styles.wrapper}>
      <h3>Стоимость</h3>
      <table>
        <tbody>
          {props.item.dp_cost === 0 ? (
            <>
              <tr>
                <td colSpan={2} style={{ textAlign: 'center' }}>
                  Цена за одну штуку:
                </td>
              </tr>
              <tr>
                <td>Цена за одну штуку без НДС</td>
                <td rowSpan={3}>цену уточняйте у поставщика</td>
              </tr>
              <tr>
                <td>НДС</td>
              </tr>
              <tr>
                <td>Цена за одну штуку c НДС</td>
              </tr>
            </>
          ) : (
            <>
              {' '}
              <tr>
                <td colSpan={2} style={{ textAlign: 'center' }}>
                  Цена за одну штуку (BYN):
                </td>
              </tr>
              <tr>
                <td>Цена без НДС</td>
                <td style={{ textAlign: 'right' }}>{costBynNoNDS}</td>
              </tr>
              <tr>
                <td>НДС</td>
                <td style={{ textAlign: 'right' }}>{costBynNDS}</td>
              </tr>
              <tr>
                <td>Цена c НДС</td>
                <td style={{ textAlign: 'right' }}>{costBynWithNDS}</td>
              </tr>
            </>
          )}
        </tbody>
      </table>
    </div>
  );
}

interface IViewCosts {
  item: ItemDto;
  itemCharacteristics: GetItemCharacteristicDto[];
}

function ViewCosts(props: IViewCosts) {
  const onBox = Number(ItemObject.getParam(props.item, 1));
  const ITEM_CHARACTERISTICS = props.item.dp_itemCharacteristics;
  const GLOBAL_CHARACTERISTICS = props.itemCharacteristics;

  const CHAR_ID = [24, 25, 29, 35, 36, 37];

  let count = 0;

  for (let i = 0; i < CHAR_ID.length; ++i) {
    for (let j = 0; j < ITEM_CHARACTERISTICS.length; ++j) {
      if (ITEM_CHARACTERISTICS[j].dp_characteristicId === CHAR_ID[i]) {
        count += 1;
        break;
      }
    }
  }

  if (count === 0) {
    return null;
  }

  return (
    <div className={styles.wrapper}>
      <h3>Цена в других валютах</h3>
      <table>
        <thead>
          <tr>
            <td colSpan={2} style={{ textAlign: 'center' }}>
              Цена за одну штуку:
            </td>
          </tr>
        </thead>
        <tbody>
          {GLOBAL_CHARACTERISTICS.map(globalCharacteristic => {
            for (let i = 0; i < ITEM_CHARACTERISTICS.length; ++i) {
              const itemCharacteristic = ITEM_CHARACTERISTICS[i];
              if (
                globalCharacteristic.dp_id ===
                itemCharacteristic.dp_characteristicId
              ) {
                if (globalCharacteristic.dp_isHidden) return null;
                for (let j = 0; j < CHAR_ID.length; ++j) {
                  if (CHAR_ID[j] === itemCharacteristic.dp_characteristicId) {
                    const name = globalCharacteristic.dp_name;
                    const cost = Number(itemCharacteristic.dp_value).toFixed(2);

                    return (
                      <tr key={itemCharacteristic.dp_characteristicId}>
                        <td>{name}</td>
                        <td style={{ textAlign: 'right' }}>{cost}</td>
                      </tr>
                    );
                  }
                }
              }
            }
            return null;
          })}
          {onBox === 0 ? null : (
            <>
              <tr>
                <td colSpan={2} style={{ textAlign: 'center' }}>
                  Цена за коробку с количеством {onBox} шт. со скидкой 5%:
                </td>
              </tr>
              {GLOBAL_CHARACTERISTICS.map(globalCharacteristics => {
                for (let i = 0; i < ITEM_CHARACTERISTICS.length; ++i) {
                  const itemCharacteristic = ITEM_CHARACTERISTICS[i];
                  if (
                    globalCharacteristics.dp_id ===
                    itemCharacteristic.dp_characteristicId
                  ) {
                    if (globalCharacteristics.dp_isHidden) return null;
                    for (let j = 0; j < CHAR_ID.length; ++j) {
                      if (
                        CHAR_ID[j] === itemCharacteristic.dp_characteristicId
                      ) {
                        const name = globalCharacteristics.dp_name;
                        const cost = Number(
                          itemCharacteristic.dp_value,
                        ).toFixed(2);
                        const costOpt = Number(
                          Number(cost) * onBox * 0.95,
                        ).toFixed(2);
                        return (
                          <tr key={itemCharacteristic.dp_characteristicId}>
                            <td>{name}</td>
                            <td>{costOpt}</td>
                          </tr>
                        );
                      }
                    }
                  }
                }
                return null;
              })}
            </>
          )}
        </tbody>
      </table>
    </div>
  );
}

interface IViewOtherCharacteristics {
  item: ItemDto;
  itemCharacteristics: GetItemCharacteristicDto[];
}

function ViewOtherCharacteristics(props: IViewOtherCharacteristics) {
  const ITEM_CHARACTERISTICS = props.item.dp_itemCharacteristics;
  const GLOBAL_CHARACTERISTICS = props.itemCharacteristics;

  return (
    <div className={styles.wrapper}>
      <h3>Дополнительные характеристики:</h3>
      <table>
        <tbody>
          {GLOBAL_CHARACTERISTICS.map(globalCharacteristic => {
            for (let i = 0; i < ITEM_CHARACTERISTICS.length; ++i) {
              const itemCharacteristic = ITEM_CHARACTERISTICS[i];
              if (
                globalCharacteristic.dp_id ===
                itemCharacteristic.dp_characteristicId
              ) {
                if (globalCharacteristic.dp_isHidden) return null;

                const name = globalCharacteristic.dp_name;
                const value = itemCharacteristic.dp_value;

                return (
                  <tr key={itemCharacteristic.dp_characteristicId}>
                    <td>{name}</td>
                    <td>{value}</td>
                  </tr>
                );
              }
            }
            return null;
          })}
        </tbody>
      </table>
    </div>
  );
}
