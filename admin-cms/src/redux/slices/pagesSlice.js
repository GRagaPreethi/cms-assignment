import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import pagesService from '../../services/pagesService';

export const fetchPages = createAsyncThunk('pages/fetchAll', async (params = {}, { rejectWithValue }) => {
  try {
    return await pagesService.getAll(params);
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to fetch pages');
  }
});

export const fetchPageById = createAsyncThunk('pages/fetchById', async (slug, { rejectWithValue }) => {
  try {
    return await pagesService.getBySlug(slug);
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to fetch page');
  }
});

export const createPage = createAsyncThunk('pages/create', async (data, { rejectWithValue }) => {
  try {
    return await pagesService.create(data);
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to create page');
  }
});

export const updatePage = createAsyncThunk('pages/update', async ({ id, data }, { rejectWithValue }) => {
  try {
    return await pagesService.update(id, data);
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to update page');
  }
});

export const deletePage = createAsyncThunk('pages/delete', async (id, { rejectWithValue }) => {
  try {
    await pagesService.delete(id);
    return id;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to delete page');
  }
});

const pagesSlice = createSlice({
  name: 'pages',
  initialState: {
    list: [],
    currentPage: null,
    pagination: null,
    isLoading: false,
    isSubmitting: false,
    error: null,
  },
  reducers: {
    clearCurrentPage: (state) => {
      state.currentPage = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPages.pending, (state) => { state.isLoading = true; state.error = null; })
      .addCase(fetchPages.fulfilled, (state, action) => {
        state.isLoading = false;
        state.list = action.payload.pages;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchPages.rejected, (state, action) => { state.isLoading = false; state.error = action.payload; })

      .addCase(fetchPageById.pending, (state) => { state.isLoading = true; state.error = null; })
      .addCase(fetchPageById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentPage = action.payload.page;
      })
      .addCase(fetchPageById.rejected, (state, action) => { state.isLoading = false; state.error = action.payload; })

      .addCase(createPage.pending, (state) => { state.isSubmitting = true; state.error = null; })
      .addCase(createPage.fulfilled, (state, action) => {
        state.isSubmitting = false;
        state.list.unshift(action.payload.page);
      })
      .addCase(createPage.rejected, (state, action) => { state.isSubmitting = false; state.error = action.payload; })

      .addCase(updatePage.pending, (state) => { state.isSubmitting = true; state.error = null; })
      .addCase(updatePage.fulfilled, (state, action) => {
        state.isSubmitting = false;
        const idx = state.list.findIndex((p) => p._id === action.payload.page._id);
        if (idx !== -1) state.list[idx] = action.payload.page;
        state.currentPage = action.payload.page;
      })
      .addCase(updatePage.rejected, (state, action) => { state.isSubmitting = false; state.error = action.payload; })

      .addCase(deletePage.pending, (state) => { state.isSubmitting = true; state.error = null; })
      .addCase(deletePage.fulfilled, (state, action) => {
        state.isSubmitting = false;
        state.list = state.list.filter((p) => p._id !== action.payload);
      })
      .addCase(deletePage.rejected, (state, action) => { state.isSubmitting = false; state.error = action.payload; });
  },
});

export const { clearCurrentPage, clearError } = pagesSlice.actions;
export default pagesSlice.reducer;
