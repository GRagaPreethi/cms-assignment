import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import authService from '../../services/authService';

export const login = createAsyncThunk('auth/login', async (credentials, { rejectWithValue }) => {
  try {
    const data = await authService.login(credentials);
    return data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Login failed');
  }
});

export const logout = createAsyncThunk('auth/logout', async (_, { rejectWithValue }) => {
  try {
    await authService.logout();
  } catch (err) {
    // Always clear local state even if API call fails
  }
  authService.clearToken();
});

export const verifyAuth = createAsyncThunk('auth/verify', async (_, { rejectWithValue }) => {
  try {
    const token = authService.getToken();
    if (!token) throw new Error('No token');
    const data = await authService.verify();
    return data;
  } catch (err) {
    authService.clearToken();
    return rejectWithValue('Session expired');
  }
});

const initialState = {
  admin: null,
  token: authService.getToken(),
  isAuthenticated: false,
  isInitializing: true,
  isLoading: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Login
    builder
      .addCase(login.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.admin = action.payload.admin;
        state.token = action.payload.token;
        state.error = null;
        authService.setToken(action.payload.token);
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = false;
        state.admin = null;
        state.token = null;
        state.error = action.payload;
      });

    // Logout
    builder
      .addCase(logout.fulfilled, (state) => {
        state.admin = null;
        state.token = null;
        state.isAuthenticated = false;
        state.error = null;
      });

    // Verify
    builder
      .addCase(verifyAuth.pending, (state) => {
        state.isInitializing = true;
      })
      .addCase(verifyAuth.fulfilled, (state, action) => {
        state.isInitializing = false;
        state.isAuthenticated = true;
        state.admin = action.payload.admin;
      })
      .addCase(verifyAuth.rejected, (state) => {
        state.isInitializing = false;
        state.isAuthenticated = false;
        state.admin = null;
        state.token = null;
      });
  },
});

export const { clearError } = authSlice.actions;
export default authSlice.reducer;
