import AppEnv from '@/AppEnv';
import HttpException from '@/utils/FetchBackend/HttpException';
import ItemCategoryDto from '@/dto/item-category/ItemCategoryDto';

export default class FetchItemCategories {
  static async get() {
    const URL = `${AppEnv.NEXT_PUBLIC__BACKEND_URL}/api/v1/item-categories`;
    const response = await fetch(URL);
    if (response.status === 200) {
      const json: ItemCategoryDto[] = await response.json();
      return json;
    }
    throw new HttpException('GET', response);
  }

  static async filterByBrand(brand: string) {
    const URL = `${AppEnv.NEXT_PUBLIC__BACKEND_URL}/api/v1/item-categories?brand=${brand}`;
    const response = await fetch(URL);
    if (response.status === 200) {
      const json: ItemCategoryDto[] = await response.json();
      return json;
    }
    throw new HttpException('GET', response);
  }

  static async filterOneByUrl(url: string) {
    const URL = `${AppEnv.NEXT_PUBLIC__BACKEND_URL}/api/v1/item-categories/filter-one/url/${url}`;
    const response = await fetch(URL);
    if (response.status === 200) {
      const json: ItemCategoryDto = await response.json();
      return json;
    }
    throw new HttpException('GET', response);
  }
}
