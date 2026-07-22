import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import pagesReducer from './slices/pagesSlice';
import loadingReducer from './slices/loadingSlice';
import errorReducer from './slices/errorSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    pages: pagesReducer,
    loading: loadingReducer,
    error: errorReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }),
});

export default store;
