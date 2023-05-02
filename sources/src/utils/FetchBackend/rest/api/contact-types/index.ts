import AppEnv from '@/AppEnv';
import HttpException from '@/utils/FetchBackend/HttpException';
import ContactTypeDto from '@/dto/contact-types/ContactTypeDto';

export default class FetchContactTypes {
  static async get() {
    const URL = `${AppEnv.NEXT_PUBLIC__BACKEND_URL}/api/v1/contact-types`;
    const response = await fetch(URL);
    if (response.status === 200) {
      const json: ContactTypeDto[] = await response.json();
      return json;
    }
    throw new HttpException('GET', response);
  }
}
