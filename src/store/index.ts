import { thunk } from 'redux-thunk';
import { configureStore } from '@reduxjs/toolkit';
import { rootReducer } from './reducers';
import { DePaByStockState } from '@/types/www.de-pa.by/api/v1/invoice/DePaByStockReducer.dto';

export interface RootStoreDto {
  DePaByStockReducer: DePaByStockState;
}

export const store = configureStore({
  reducer: rootReducer,
  devTools: true,
  middleware: getDefaultMiddleware => getDefaultMiddleware().concat(thunk), // Включаем Thunk Middleware в список middleware
});
