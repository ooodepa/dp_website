import GetUnpDto from './dto/get-unp.dto';
import FetchBackend from '@/utils/FetchBackend';
import HttpException from '@/utils/FetchBackend/HttpException';

export default class FetchUnp {
  static async get(unp: string) {
    const result = await FetchBackend(
      'none',
      'GET',
      `portal-nalog-gov-by/${unp}`,
    );
    const response = result.response;

    if (response.status === 200) {
      const json: GetUnpDto = await response.json();
      return json;
    }

    throw new HttpException(result.method, response);
  }
}
