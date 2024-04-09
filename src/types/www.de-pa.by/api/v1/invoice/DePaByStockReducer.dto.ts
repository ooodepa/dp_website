import { DePaByStockDto } from './DePaByStock.dto';

export interface DePaByStockState {
  stock: {
    data: DePaByStockDto;
    loading: boolean;
    error: string | null;
  };
}

export enum DePaByStockTypes {
  FETCH_DEPABY_STOCK = 'FETCH_DEPABY_STOCK',
  FETCH_DEPABY_STOCK_SUCCESS = 'FETCH_DEPABY_STOCK_SUCCESS',
  FETCH_DEPABY_STOCK_ERROR = 'FETCH_DEPABY_STOCK_ERROR',
}

interface DePaByStock {
  type: DePaByStockTypes.FETCH_DEPABY_STOCK;
}

interface DePaByStockSuccess {
  type: DePaByStockTypes.FETCH_DEPABY_STOCK_SUCCESS;
  payload: DePaByStockDto;
}

interface DePaByStockError {
  type: DePaByStockTypes.FETCH_DEPABY_STOCK_ERROR;
  payload: string;
}

export type DePaByStockAction =
  | DePaByStock
  | DePaByStockSuccess
  | DePaByStockError;
