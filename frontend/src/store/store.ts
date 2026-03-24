import { configureStore } from '@reduxjs/toolkit';
import productReducer from './slices/productSlice';
import transactionReducer from './slices/transactionSlice';
import uiReducer from './slices/uiSlice';

export const store = configureStore({
  reducer: {
    products: productReducer,
    transaction: transactionReducer,
    ui: uiReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;