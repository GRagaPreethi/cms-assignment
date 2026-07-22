import { configureStore } from '@reduxjs/toolkit';
import pagesReducer from './slices/pagesSlice';
import loadingReducer from './slices/loadingSlice';
import errorReducer from './slices/errorSlice';

export const store = configureStore({
  reducer: {
    pages: pagesReducer,
    loading: loadingReducer,
    error: errorReducer,
  },
});

export default store;
