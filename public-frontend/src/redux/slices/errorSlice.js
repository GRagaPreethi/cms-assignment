import { createSlice } from '@reduxjs/toolkit';

const errorSlice = createSlice({
  name: 'error',
  initialState: { global: null, keys: {} },
  reducers: {
    setGlobalError: (state, action) => { state.global = action.payload; },
    clearGlobalError: (state) => { state.global = null; },
    setError: (state, action) => { state.keys[action.payload.key] = action.payload.message; },
    clearError: (state, action) => { delete state.keys[action.payload]; },
  },
});

export const { setGlobalError, clearGlobalError, setError, clearError } = errorSlice.actions;
export default errorSlice.reducer;
