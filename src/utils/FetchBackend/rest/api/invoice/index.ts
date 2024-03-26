import FetchBackend from '@/utils/FetchBackend';
import HttpException from '@/utils/FetchBackend/HttpException';

export default class FetchInvoice {
  static async getReportStock() {
    const result = await FetchBackend('none', 'GET', 'invoice/report/stock');
    const response = result.response;

    if (response.status === 200) {
      const json: Record<string, number> = await response.json();
      return json;
    }

    throw new HttpException(result.method, response);
  }
}
