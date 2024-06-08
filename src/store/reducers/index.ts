import { combineReducers } from 'redux';
import { InventoryReducer } from './inventory-reducer';

export const rootReducer = combineReducers({
  InventoryReducer,
});

export type RootState = ReturnType<typeof rootReducer>;
