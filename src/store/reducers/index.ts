import { combineReducers } from 'redux';
import { DePaByStockReducer } from './DePaByStockReducer';

export const rootReducer = combineReducers({
  DePaByStockReducer,
});

export type RootState = ReturnType<typeof rootReducer>;
