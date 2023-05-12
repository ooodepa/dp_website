import AppEnv from '@/AppEnv';
import FetchBackend from '@/utils/FetchBackend';
import HttpException from '@/utils/FetchBackend/HttpException';

export default class FetchUsers {
  static async isAdmin() {
    const result = await FetchBackend('access', 'POST', 'users/is-admin');
    const response = result.response;

    if (response.status === 200) {
      return true;
    }

    throw new HttpException(result.method, response);
  }
}
