import GetItemDto from './get-item.dto';

export default interface GetItemPagination {
  code: number;
  status: string;
  message: string;
  pagination: {
    current_page: number;
    last_page: number;
    limit_items: number;
    skip_items: number;
    total_items: number;
  };
  data: GetItemDto[];
}
