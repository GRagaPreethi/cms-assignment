import { createSlice } from '@reduxjs/toolkit';

const loadingSlice = createSlice({
  name: 'loading',
  initialState: { global: false, keys: {} },
  reducers: {
    setGlobalLoading: (state, action) => { state.global = action.payload; },
    setLoading: (state, action) => { state.keys[action.payload.key] = action.payload.value; },
    clearLoading: (state, action) => { delete state.keys[action.payload]; },
  },
});

export const { setGlobalLoading, setLoading, clearLoading } = loadingSlice.actions;
export default loadingSlice.reducer;
