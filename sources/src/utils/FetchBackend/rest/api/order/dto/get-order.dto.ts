interface OrderItem {
  dp_id: number;
  dp_orderId: string;
  dp_itemId: string;
  dp_count: number;
  dp_cost: number;
}

export default interface GetOrderDto {
  dp_id: string;
  dp_date: string;
  dp_userId: number;
  dp_cancaledOn: string;
  dp_fulfilledOn: string;
  dp_receivedOn: string;
  dp_orderItems: [];
}
