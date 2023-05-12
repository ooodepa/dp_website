import AppEnv from '@/AppEnv';
import HttpException from '@/utils/FetchBackend/HttpException';

export default class FetchUsers {
  static async isAdmin() {
    const accessToken = localStorage.getItem('access');

    const URL = `${AppEnv.NEXT_PUBLIC__BACKEND_URL}/api/v1/users/is-admin`;
    const response = await fetch(URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    if (response.status === 200) {
      return true;
    }
    if (response.status === 401) {
      return false;
    }
    throw new HttpException('POST', response);
  }
}
