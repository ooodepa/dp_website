import { AppResponse } from '@/store/AppResponse.dto';
import GetItemDto from '@/utils/FetchBackend/rest/api/items/dto/get-item.dto';

export interface QueryGetInventoryDto {
  dp_warehouseId?: number;
}

export interface GetInventoryDto {
  dp_id: number;
  dp_warehouseId: number;
  dp_vendorId: string;
  dp_count: number;
  dp_note: string;
}

export const emptyInventoryDto: GetInventoryDto[] = [];

export interface ResponseGetInventoryDto extends AppResponse {
  data: GetInventoryDto[];
}

export interface InventoryState {
  inventory: GetInventoryDto[];
  items: GetItemDto[];
  isLoading: boolean;
  loadingStatus: string;
  isLoaded: boolean;
  error: string | null;
}

export enum InventoryTypes {
  FETCH_INVENTORY = 'FETCH_INVENTORY',
  FETCH_INVENTORY_LOADING = 'FETCH_INVENTORY_LOADING',
  FETCH_INVENTORY_SUCCESS = 'FETCH_INVENTORY_SUCCESS',
  FETCH_INVENTORY_ERROR = 'FETCH_INVENTORY_ERROR',
}

interface Inventory {
  type: InventoryTypes.FETCH_INVENTORY;
}

interface InventoryLoading {
  type: InventoryTypes.FETCH_INVENTORY_LOADING;
  payload: string;
}

interface InventorySuccess {
  type: InventoryTypes.FETCH_INVENTORY_SUCCESS;
  payload: {
    inventory: GetInventoryDto[];
    items: GetItemDto[];
  };
}

interface InventoryError {
  type: InventoryTypes.FETCH_INVENTORY_ERROR;
  payload: string;
}

export type InventoryAction =
  | Inventory
  | InventoryLoading
  | InventorySuccess
  | InventoryError;
