import { configureStore } from '@reduxjs/toolkit';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import authReducer from './slices/authSlice';
import productReducer from './slices/productSlice';
import brandReducer from './slices/brandSlice';
import categoryReducer from './slices/categorySlice';
import adminReducer from './slices/adminSlice';
import cartReducer from './slices/cartSlice';
import paymentReducer from './slices/paymentSlice';
import orderReducer from './slices/orderSlice';
import profileReducer from './slices/profileSlice';
import tryOnReducer from './slices/tryOnSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    products: productReducer,
    brands: brandReducer,
    categories: categoryReducer,
    admin: adminReducer,
    cart: cartReducer,
    payment: paymentReducer,
    orders: orderReducer,
    profile: profileReducer,
    tryOn: tryOnReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['auth/setSession'],
        ignoredPaths: ['auth.session', 'auth.user'],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Typed hooks
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export default store;
