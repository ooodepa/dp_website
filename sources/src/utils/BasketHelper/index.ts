import IBasketItem from './dto/IBasketItem.dto';
import GetItemDto from '../FetchBackend/rest/api/items/dto/get-item.dto';

class BasketHelper {
  static getBasket() {
    let stringBasket = localStorage.getItem('dp_basket');

    if (!stringBasket) {
      localStorage.setItem('dp_basket', JSON.stringify({}));
      stringBasket = localStorage.getItem('dp_basket');
    }

    const basket = JSON.parse(stringBasket as string);

    return basket;
  }

  static getModels() {
    const basket = BasketHelper.getBasket();
    const models = Object.keys(basket);
    return models;
  }

  static plus(model: string) {
    const basket = BasketHelper.getBasket();

    let count = model in basket ? Number(basket[model]) : 0;

    count += 1;

    basket[model] = count;

    localStorage.setItem('dp_basket', JSON.stringify(basket));
  }

  static minus(model: string) {
    const basket = BasketHelper.getBasket();

    let count = model in basket ? Number(basket[model]) : 0;

    count -= 1;

    count = count <= 0 ? 0 : count;

    basket[model] = count;

    if (count <= 0) {
      delete basket[model];
    }

    localStorage.setItem('dp_basket', JSON.stringify(basket));
  }

  static getCount(model: string) {
    const basket = BasketHelper.getBasket();

    if (!basket[model]) {
      return 0;
    }

    return basket[model];
  }

  static setCount(model: string, count: number) {
    if (count <= 0) {
      return;
    }

    const basket = BasketHelper.getBasket();
    basket[model] = count;

    localStorage.setItem('dp_basket', JSON.stringify(basket));
  }

  static getBasketArray(products: GetItemDto[]): IBasketItem[] {
    const basket = BasketHelper.getBasket();
    const keys = Object.keys(basket);

    let arr: IBasketItem[] = [];

    for (let i = 0; i < keys.length; ++i) {
      const key = keys[i];
      const value = basket[key];

      const model = key;
      const count = value;

      for (let j = 0; j < products.length; ++j) {
        if (model === products[j].dp_model) {
          arr.push({
            dp_id: products[j].dp_id,
            dp_model: model,
            dp_name: products[j].dp_name,
            dp_img: products[j].dp_photoUrl,
            dp_cost: products[j].dp_cost,
            dp_count: count,
          });
          break;
        }
      }
    }

    return arr;
  }

  static clear() {
    localStorage.removeItem('dp_basket');
  }
}

export default BasketHelper;
