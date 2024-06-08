import { thunk } from 'redux-thunk';
import { configureStore } from '@reduxjs/toolkit';
import { rootReducer } from './reducers';
import { InventoryState } from '@/store/reducers/inventory-reducer.dto';

export interface RootStoreDto {
  InventoryReducer: InventoryState;
}

export const store = configureStore({
  reducer: rootReducer,
  devTools: true,
  middleware: getDefaultMiddleware => getDefaultMiddleware().concat(thunk), // Включаем Thunk Middleware в список middleware
});
