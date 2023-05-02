import AppEnv from '@/AppEnv';
import ItemDto from '@/dto/item/ItemDto';
import ItemByIdDto from '@/dto/item/ItemByIdDto';
import HttpException from '@/utils/FetchBackend/HttpException';

export default class FetchItems {
  static async get() {
    const URL = `${AppEnv.NEXT_PUBLIC__BACKEND_URL}/api/v1/items`;
    const response = await fetch(URL);
    if (response.status === 200) {
      const json: ItemDto[] = await response.json();
      return json;
    }
    throw new HttpException('GET', response);
  }

  static async filterByCategory(category: string) {
    const URL = `${AppEnv.NEXT_PUBLIC__BACKEND_URL}/api/v1/items?category=${category}`;
    const response = await fetch(URL);
    if (response.status === 200) {
      const json: ItemDto[] = await response.json();
      return json;
    }
    throw new HttpException('GET', response);
  }

  static async filterOneByModel(model: string) {
    const URL = `${AppEnv.NEXT_PUBLIC__BACKEND_URL}/api/v1/items/filter-one/model/${model}`;
    const response = await fetch(URL);
    if (response.status === 200) {
      const json: ItemByIdDto = await response.json();
      return json;
    }
    throw new HttpException('GET', response);
  }
}
