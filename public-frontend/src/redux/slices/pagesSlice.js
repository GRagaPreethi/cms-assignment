import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import pagesService from '../../services/pagesService';

export const fetchPublishedPages = createAsyncThunk(
  'pages/fetchPublished',
  async (params = {}, { rejectWithValue }) => {
    try {
      return await pagesService.getAllPublished(params);
    } catch (err) {
      return rejectWithValue(err?.message || 'Failed to fetch pages');
    }
  }
);

export const fetchPageBySlug = createAsyncThunk(
  'pages/fetchBySlug',
  async (slug, { rejectWithValue }) => {
    try {
      return await pagesService.getBySlug(slug);
    } catch (err) {
      return rejectWithValue(err?.message || 'Page not found');
    }
  }
);

const pagesSlice = createSlice({
  name: 'pages',
  initialState: {
    list: [],
    currentPage: null,
    pagination: null,
    isLoading: false,
    isPageLoading: false,
    error: null,
    pageError: null,
  },
  reducers: {
    clearCurrentPage: (state) => {
      state.currentPage = null;
      state.pageError = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPublishedPages.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchPublishedPages.fulfilled, (state, action) => {
        state.isLoading = false;
        state.list = action.payload.pages || [];
        state.pagination = action.payload.pagination || null;
      })
      .addCase(fetchPublishedPages.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      .addCase(fetchPageBySlug.pending, (state) => {
        state.isPageLoading = true;
        state.pageError = null;
        state.currentPage = null;
      })
      .addCase(fetchPageBySlug.fulfilled, (state, action) => {
        state.isPageLoading = false;
        state.currentPage = action.payload.page;
      })
      .addCase(fetchPageBySlug.rejected, (state, action) => {
        state.isPageLoading = false;
        state.pageError = action.payload;
      });
  },
});

export const { clearCurrentPage, clearError } = pagesSlice.actions;
export default pagesSlice.reducer;
