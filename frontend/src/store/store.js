import { configureStore } from '@reduxjs/toolkit'
import userReducer from './userSlice'
import productsReducer from "./productsSlice";
import cartsReducer from './cartsSlice';
import orderReducer from './orderSlice';

export const store = configureStore({
  reducer: {
    user: userReducer,
    products: productsReducer,
    carts: cartsReducer,
    order:orderReducer,
  },
});