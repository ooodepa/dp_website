import GetOrderDto from './dto/get-order.dto';
import FetchBackend from '@/utils/FetchBackend';
import SendCheckDto from './dto/send-check.dto';
import CreateOrderDto from './dto/create-order.dto';
import HttpException from '@/utils/FetchBackend/HttpException';

export default class FetchOrders {
  static async create(dto: CreateOrderDto) {
    const result = await FetchBackend('access', 'POST', 'orders', dto);
    const response = result.response;

    if (response.status === 201) {
      const json: CreateOrderResponseDto = await response.json();
      return json;
    }

    throw new HttpException(result.method, response);
  }

  static async sendCheck(dto: SendCheckDto, orderId: string) {
    const result = await FetchBackend(
      'access',
      'POST',
      `orders/${orderId}/send-check`,
      dto,
    );
    const response = result.response;

    if (response.status === 200) {
      return true;
    }

    throw new HttpException(result.method, response);
  }

  static async get() {
    const result = await FetchBackend('access', 'GET', `orders`);
    const response = result.response;

    if (response.status === 200) {
      const json: GetOrderDto[] = await response.json();
      return json;
    }

    throw new HttpException(result.method, response);
  }
}
