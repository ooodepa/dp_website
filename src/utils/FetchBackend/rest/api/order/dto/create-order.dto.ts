interface OrderItem {
  dp_itemId: string;
  dp_count: number;
}

export default interface CreateOrderDto {
  dp_orderItems: OrderItem[];
}
