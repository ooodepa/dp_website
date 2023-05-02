import AppEnv from '@/AppEnv';
import HttpException from '@/utils/FetchBackend/HttpException';
import ItemCharacteristicsDto from '@/dto/item-characteristics/ItemCharacteristicsDto';

export default class FetchItemCharacteristics {
  static async get() {
    const URL = `${AppEnv.NEXT_PUBLIC__BACKEND_URL}/api/v1/item-characteristics`;
    const response = await fetch(URL);
    if (response.status === 200) {
      const json: ItemCharacteristicsDto[] = await response.json();
      return json;
    }
    throw new HttpException('GET', response);
  }
}
