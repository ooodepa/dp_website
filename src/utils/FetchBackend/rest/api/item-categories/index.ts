import FetchBackend from '@/utils/FetchBackend';
import GetItemCategoryDto from './dto/get-item-category.dto';
import HttpException from '@/utils/FetchBackend/HttpException';

export default class FetchItemCategories {
  static async get() {
    const result = await FetchBackend('none', 'GET', 'item-categories');
    const response = result.response;

    if (response.status === 200) {
      const json: GetItemCategoryDto[] = await response.json();
      return json.sort((a, b) => a.dp_sortingIndex - b.dp_sortingIndex);
    }

    throw new HttpException(result.method, response);
  }

  static async getById(id: number) {
    const result = await FetchBackend('none', 'GET', `item-categories/${id}`);
    const response = result.response;

    if (response.status === 200) {
      const json: GetItemCategoryDto = await response.json();
      return json;
    }

    throw new HttpException(result.method, response);
  }

  static async filterByBrand(brand: string) {
    const result = await FetchBackend(
      'none',
      'GET',
      `item-categories?brand=${brand}`,
    );
    const response = result.response;

    if (response.status === 200) {
      const json: GetItemCategoryDto[] = await response.json();
      return json.sort((a, b) => a.dp_sortingIndex - b.dp_sortingIndex);
    }

    throw new HttpException(result.method, response);
  }

  static async filterOneByUrl(url: string) {
    const result = await FetchBackend(
      'none',
      'GET',
      `item-categories/filter-one/url/${url}`,
    );
    const response = result.response;

    if (response.status === 200) {
      const json: GetItemCategoryDto = await response.json();
      return json;
    }

    throw new HttpException(result.method, response);
  }
}
