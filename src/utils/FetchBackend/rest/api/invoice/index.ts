import FetchBackend from '@/utils/FetchBackend';
import HttpException from '@/utils/FetchBackend/HttpException';
import {
  QueryGetInventoryDto,
  ResponseGetInventoryDto,
} from '@/store/reducers/inventory-reducer.dto';
import { ReponseGetWarehousesDto } from '@/store/reducers/warehouse-reducer.dto';

export default class FetchInvoice {
  static async getReportStock(query: QueryGetInventoryDto) {
    let uri = 'invoice/x/warehouses/x/inventory-items?';

    if (query.dp_warehouseId) {
      uri += `dp_warehouseId=${query.dp_warehouseId}&`;
    }

    const result = await FetchBackend('none', 'GET', uri);
    const response = result.response;

    if (response.status === 200) {
      const json: ResponseGetInventoryDto = await response.json();
      return json;
    }

    throw new HttpException(result.method, response);
  }

  static async getWarehouses() {
    const URI = 'invoice/x/warehouses';
    const result = await FetchBackend('none', 'GET', URI);
    const response = result.response;

    if (response.status === 200) {
      const json: ReponseGetWarehousesDto = await response.json();
      return json;
    }

    throw new HttpException(result.method, response);
  }
}
