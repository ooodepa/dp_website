import AppEnv from '@/AppEnv';
import HelperDto from '@/dto/helpers/HelperDto';
import HttpException from '@/utils/FetchBackend/HttpException';

export default class FetchHelpers {
  static async get() {
    const URL = `${AppEnv.NEXT_PUBLIC__BACKEND_URL}/api/v1/helpers`;
    const response = await fetch(URL);
    if (response.status === 200) {
      const json: HelperDto[] = await response.json();
      return json;
    }
    throw new HttpException('GET', response);
  }
}
