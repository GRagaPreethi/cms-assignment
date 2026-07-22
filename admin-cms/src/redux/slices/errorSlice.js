import { createSlice } from '@reduxjs/toolkit';

const errorSlice = createSlice({
  name: 'error',
  initialState: {
    global: null,
    keys: {},
  },
  reducers: {
    setGlobalError: (state, action) => {
      state.global = action.payload;
    },
    clearGlobalError: (state) => {
      state.global = null;
    },
    setError: (state, action) => {
      const { key, message } = action.payload;
      state.keys[key] = message;
    },
    clearError: (state, action) => {
      delete state.keys[action.payload];
    },
    clearAllErrors: (state) => {
      state.global = null;
      state.keys = {};
    },
  },
});

export const { setGlobalError, clearGlobalError, setError, clearError, clearAllErrors } = errorSlice.actions;
export const selectError = (key) => (state) => state.error.keys[key] || null;
export default errorSlice.reducer;
