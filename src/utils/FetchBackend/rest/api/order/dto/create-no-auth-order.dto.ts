interface OrderItem {
  dp_itemId: string;
  dp_count: number;
}

export default interface CreateNoAuthOrderDto {
  dp_name: string;
  dp_email: string;
  dp_phone: string;
  dp_orderItems: OrderItem[];
}
