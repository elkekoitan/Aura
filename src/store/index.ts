/**
 * @module store/index
 * @description Configures the Redux store for the application, combining all the different slices
 * into a single store. It also exports typed hooks for dispatching actions and selecting state.
 */

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

/**
 * The configured Redux store for the application.
 * @type {Store}
 */
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

/**
 * The root state type of the Redux store.
 * @typedef {ReturnType<typeof store.getState>} RootState
 */
export type RootState = ReturnType<typeof store.getState>;
/**
 * The dispatch type of the Redux store.
 * @typedef {typeof store.dispatch} AppDispatch
 */
export type AppDispatch = typeof store.dispatch;

/**
 * A typed version of the `useDispatch` hook.
 * @returns {AppDispatch} The dispatch function.
 */
export const useAppDispatch = () => useDispatch<AppDispatch>();
/**
 * A typed version of the `useSelector` hook.
 * @type {TypedUseSelectorHook<RootState>}
 */
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export default store;
