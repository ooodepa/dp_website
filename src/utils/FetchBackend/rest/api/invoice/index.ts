import { DePaByStockDto } from '@/types/www.de-pa.by/api/v1/invoice/DePaByStock.dto';
import FetchBackend from '@/utils/FetchBackend';
import HttpException from '@/utils/FetchBackend/HttpException';

export default class FetchInvoice {
  static async getReportStock() {
    const result = await FetchBackend('none', 'GET', 'invoice/report/stock');
    const response = result.response;

    if (response.status === 200) {
      const json: DePaByStockDto = await response.json();
      return json;
    }

    throw new HttpException(result.method, response);
  }
}
