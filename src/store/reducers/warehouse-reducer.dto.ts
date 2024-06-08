import { AppResponse } from '../AppResponse.dto';

export interface WarehouseDto {
  dp_id: number;
  dp_name: string;
}

export interface DataGetWarehousesDto extends WarehouseDto {}

export interface ReponseGetWarehousesDto extends AppResponse {
  data: DataGetWarehousesDto[];
}
