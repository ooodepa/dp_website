import AppEnv from '@/AppEnv';
import ItemBrandDto from '@/dto/item-brand/ItemBrandDto';
import HttpException from '@/utils/FetchBackend/HttpException';

export default class FetchItemBrand {
  static async get() {
    const URL = `${AppEnv.NEXT_PUBLIC__BACKEND_URL}/api/v1/item-brands`;
    const response = await fetch(URL);
    if (response.status === 200) {
      const json: ItemBrandDto[] = await response.json();
      return json;
    }
    throw new HttpException('GET', response);
  }

  static async filterOneByUrl(url: string) {
    const URL = `${AppEnv.NEXT_PUBLIC__BACKEND_URL}/api/v1/item-brands/filter-one/url/${url}`;
    const response = await fetch(URL);
    if (response.status === 200) {
      const json: ItemBrandDto = await response.json();
      return json;
    }
    throw new HttpException('GET', response);
  }
}
