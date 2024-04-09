import {
  DePaByStockAction,
  DePaByStockState,
  DePaByStockTypes,
} from '@/types/www.de-pa.by/api/v1/invoice/DePaByStockReducer.dto';
import { emptyDePaByStock } from '@/types/www.de-pa.by/api/v1/invoice/DePaByStock.dto';

const defaultStore: DePaByStockState = {
  stock: {
    data: emptyDePaByStock,
    loading: false,
    error: null,
  },
};

export function DePaByStockReducer(
  state = defaultStore,
  action: DePaByStockAction,
): DePaByStockState {
  switch (action.type) {
    case DePaByStockTypes.FETCH_DEPABY_STOCK:
      return {
        ...state,
        stock: {
          data: emptyDePaByStock,
          loading: true,
          error: null,
        },
      };
    case DePaByStockTypes.FETCH_DEPABY_STOCK_SUCCESS:
      return {
        ...state,
        stock: {
          data: action.payload,
          loading: false,
          error: null,
        },
      };
    case DePaByStockTypes.FETCH_DEPABY_STOCK_ERROR:
      return {
        ...state,
        stock: {
          data: emptyDePaByStock,
          loading: false,
          error: action.payload,
        },
      };
    default:
      return state;
  }
}
