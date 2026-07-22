import { createSlice } from '@reduxjs/toolkit';

const loadingSlice = createSlice({
  name: 'loading',
  initialState: {
    global: false,
    keys: {},
  },
  reducers: {
    setGlobalLoading: (state, action) => {
      state.global = action.payload;
    },
    setLoading: (state, action) => {
      const { key, value } = action.payload;
      state.keys[key] = value;
    },
    clearLoading: (state, action) => {
      delete state.keys[action.payload];
    },
  },
});

export const { setGlobalLoading, setLoading, clearLoading } = loadingSlice.actions;
export const selectLoading = (key) => (state) => state.loading.keys[key] || false;
export default loadingSlice.reducer;
