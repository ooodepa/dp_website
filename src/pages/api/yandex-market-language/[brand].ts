import { NextApiRequest, NextApiResponse } from 'next';

import FetchItems from '@/utils/FetchBackend/rest/api/items';
import FetchItemBrand from '@/utils/FetchBackend/rest/api/item-brands';
import ItemObject from '@/utils/FetchBackend/rest/api/items/dto/ItemObject';
import FetchItemCategories from '@/utils/FetchBackend/rest/api/item-categories';
import FetchItemCharacteristics from '@/utils/FetchBackend/rest/api/item-characteristics';

function ItemBrandId2YmlCategoryId(dp_itemBrandId: number) {
  return dp_itemBrandId;
}

function ItemCategoryId2YmlCategoryId(dp_itemCategoryId: number) {
  return dp_itemCategoryId + 1000000;
}

function YmlTag(
  tabs: number,
  tagName: string,
  value: string,
  params: Record<string, string> = {},
) {
  const resultValue = value.replaceAll('&', '&amp;');
  const keys = Object.keys(params).map(key => {
    const resultParamValue = params[key].replaceAll('&', '&amp;');
    return ` ${key}="${resultParamValue}"`;
  });

  return `${'\t'.repeat(
    tabs,
  )}<${tagName}${keys}>${resultValue}</${tagName}> \n`;
}

export default async function SitemapXml(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  try {
    const brand = `${req.query.brand}`;
    const items = await FetchItems.filterByBrand(brand);
    const categories = await FetchItemCategories.filterByBrand(brand);
    const brands = [await FetchItemBrand.filterOneByUrl(brand)];
    const characteristics = await FetchItemCharacteristics.get();

    let YandexMarketLanuage = '';
    YandexMarketLanuage += '<?xml version="1.0" encoding="UTF-8"?>\n';
    YandexMarketLanuage += `<yml_catalog date="${new Date().toJSON()}">\n`;
    YandexMarketLanuage += '\t<shop>\n';
    YandexMarketLanuage += '\t\t<name>ООО "ДЕ-ПА"</name>\n';
    YandexMarketLanuage += '\t\t<company>DE-PA ELECTRIC</company>\n';
    YandexMarketLanuage += '\t\t<url>https://de-pa.by</url>\n';
    YandexMarketLanuage += '\t\t<platform>ООО "ДЕ-ПА"</platform>\n';
    YandexMarketLanuage += '\t\t<categories>\n';

    for (let i = 0; i < brands.length; ++i) {
      const brand = brands[i];

      if (brand.dp_isHidden) {
        continue;
      }

      const id = ItemBrandId2YmlCategoryId(brand.dp_id);
      const name = brand.dp_name;
      YandexMarketLanuage += `\t\t\t<category id="${id}">${name}</category>\n`;
    }

    for (let i = 0; i < brands.length; ++i) {
      const brand = brands[i];
      for (let j = 0; j < categories.length; ++j) {
        const category = categories[j];
        if (category.dp_itemBrandId === brand.dp_id) {
          if (category.dp_isHidden) {
            continue;
          }

          const id = ItemCategoryId2YmlCategoryId(category.dp_id);
          const parentId = category.dp_itemBrandId;
          const name = category.dp_name;
          YandexMarketLanuage += `\t\t\t<category id="${id}" parentId="${parentId}">${name}</category>\n`;
        }
      }
    }

    YandexMarketLanuage += '\t\t</categories>\n';

    YandexMarketLanuage += '\t\t<offers>\n';

    for (let j = 0; j < brands.length; ++j) {
      const brand = brands[j];

      if (brand.dp_isHidden) {
        continue;
      }

      for (let k = 0; k < categories.length; ++k) {
        const category = categories[k];

        if (category.dp_isHidden) {
          continue;
        }

        if (brand.dp_id === category.dp_itemBrandId) {
          for (let q = 0; q < items.length; ++q) {
            const item = items[q];

            if (category.dp_id === item.dp_itemCategoryId) {
              if (item.dp_isHidden) {
                continue;
              }

              const id = item.dp_id;
              let name = item.dp_name;
              const vendor = brand.dp_name;
              const vendorCode = item.dp_model;
              const url = `https://de-pa.by/products/${brand.dp_urlSegment}/${category.dp_urlSegment}/${item.dp_model}`;
              // const price = item.dp_cost;
              const numPrice = Number(ItemObject.getParam(item, 29));
              const numOnBox = Number(ItemObject.getParam(item, 1));

              const xBox = ItemObject.getParam(item, 26);
              const yBox = ItemObject.getParam(item, 27);
              const zBox = ItemObject.getParam(item, 28);

              if (!numPrice) {
                continue;
              }

              let price = Number(numPrice).toFixed(2);
              if (numOnBox) {
                price = Number(numPrice * numOnBox).toFixed(2);
                name = `${item.dp_name} (за ${numOnBox} шт.)`;
              }

              const oldprice = '';
              const enable_auto_discounts = 'false';
              const currencyId = 'BYN';
              const categoryId = ItemCategoryId2YmlCategoryId(
                item.dp_itemCategoryId,
              );
              const picture = item.dp_photoUrl;
              let description = '';
              description += '\n\t\t\t\t\t<![CDATA[\n';
              const dArr = item.dp_seoDescription.split('\n');
              for (let ii = 0; ii < dArr.length; ++ii) {
                let current = dArr[ii];
                if (current.length === 0) {
                  current = '.';
                }
                description += `\t\t\t\t\t\t<p>${current}</p>\n`;
              }
              description += '\t\t\t\t\t]]>\n\t\t\t\t';

              //   const sales_notes = '';
              const manufacturer_warranty = 'true';
              const barcode = ItemObject.getParam(item, 22);
              const color = ItemObject.getParam(item, 8);
              const weight = ItemObject.getParam(item, 2);

              YandexMarketLanuage += `\t\t\t<offer id="${id}">\n`;
              // YandexMarketLanuage += `\t\t\t\t<name>${name}</name>\n`;
              YandexMarketLanuage += YmlTag(4, 'name', name);
              YandexMarketLanuage += `\t\t\t\t<vendor>${vendor}</vendor>\n`;
              YandexMarketLanuage += `\t\t\t\t<vendorCode>${vendorCode}</vendorCode>\n`;
              YandexMarketLanuage += `\t\t\t\t<url>${url}</url>\n`;
              YandexMarketLanuage += `\t\t\t\t<price>${price}</price>\n`;
              //   YandexMarketLanuage += `\t\t\t\t<oldprice>${oldprice}</oldprice>\n`);
              YandexMarketLanuage += `\t\t\t\t<enable_auto_discounts>${enable_auto_discounts}</enable_auto_discounts>\n`;
              YandexMarketLanuage += `\t\t\t\t<currencyId>${currencyId}</currencyId>\n`;
              YandexMarketLanuage += `\t\t\t\t<categoryId>${categoryId}</categoryId>\n`;
              YandexMarketLanuage += `\t\t\t\t<picture>${picture}</picture>\n`;

              for (let ii = 0; ii < item.dp_itemGalery.length; ++ii) {
                const galeryItem = item.dp_itemGalery[ii];
                YandexMarketLanuage += `\t\t\t\t<picture>${galeryItem.dp_photoUrl}</picture>\n`;
              }

              YandexMarketLanuage += `\t\t\t\t<description>${description}</description>\n`;
              //   YandexMarketLanuage += `\t\t\t\t<sales_notes>${sales_notes}</sales_notes>\n`;
              YandexMarketLanuage += `\t\t\t\t<manufacturer_warranty>${manufacturer_warranty}</manufacturer_warranty>\n`;

              if (barcode.length > 0) {
                YandexMarketLanuage += `\t\t\t\t<barcode>${barcode}</barcode>\n`;
              }

              YandexMarketLanuage +=
                color.length === 0
                  ? ''
                  : `\t\t\t\t<param name="Цвет">${color}</param>\n`;
              const ch = item.dp_itemCharacteristics;
              for (let ii = 0; ii < characteristics.length; ++ii) {
                const currentCharacteristic = characteristics[ii];
                for (let jj = 0; jj < ch.length; ++jj) {
                  const currentCh = ch[jj];
                  if (
                    currentCh.dp_characteristicId ===
                    currentCharacteristic.dp_id
                  ) {
                    if (currentCharacteristic.dp_isHidden) {
                      break;
                    }
                    YandexMarketLanuage +=
                      color.length === 0
                        ? ''
                        : // : `\t\t\t\t<param name="${currentCharacteristic.dp_name}">${currentCh.dp_value}</param>\n`;
                          YmlTag(4, 'param', currentCh.dp_value, {
                            name: currentCharacteristic.dp_name,
                          });
                    break;
                  }
                }
              }
              YandexMarketLanuage +=
                weight.length === 0
                  ? ''
                  : `\t\t\t\t<weight>${weight}</weight>\n`;

              if (xBox.length && yBox.length && zBox.length) {
                YandexMarketLanuage += `\t\t\t\t<dimensions>${xBox}/${yBox}/${zBox}</dimensions>\n`;
              }

              YandexMarketLanuage += `\t\t\t</offer>\n`;
            }
          }
        }
      }
      break;
    }

    YandexMarketLanuage += '\t\t</offers>\n';
    YandexMarketLanuage += '\t</shop>\n';
    YandexMarketLanuage += '</yml_catalog>';

    res.setHeader('Content-Type', 'text/xml');
    res.write(YandexMarketLanuage);
    res.end();
  } catch (exception) {
    const statusCode = 500;
    res.setHeader('Content-Type', 'text/json');
    res.json({
      statusCode,
      message: '' + exception,
    });
    res.status(statusCode);
    res.end();
  }
}
