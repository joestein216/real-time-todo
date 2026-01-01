import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import type { Category } from '../types';
import { api } from '../api';

type CategoriesState = {
  entities: Record<string, Category>;
  ids: string[];
  status: 'idle' | 'loading' | 'error';
  error?: string;
};

const initialState: CategoriesState = { entities: {}, ids: [], status: 'idle' };

export const fetchCategories = createAsyncThunk('categories/fetchAll', async () => {
  return api.getCategories();
});

export const createCategory = createAsyncThunk('categories/create', async (input: { name: string }) => {
  return api.createCategory(input);
});

const slice = createSlice({
  name: 'categories',
  initialState,
  reducers: {},
  extraReducers: (b) => {
    b.addCase(fetchCategories.pending, (s) => { s.status = 'loading'; s.error = undefined; });
    b.addCase(fetchCategories.fulfilled, (s, a) => {
      s.status = 'idle';
      s.entities = {};
      s.ids = [];
      for (const c of a.payload) {
        s.entities[c.id] = c;
        s.ids.push(c.id);
      }
    });
    b.addCase(fetchCategories.rejected, (s, a) => { s.status = 'error'; s.error = a.error.message; });

    b.addCase(createCategory.fulfilled, (s, a) => {
      const c = a.payload;
      s.entities[c.id] = c;
      if (!s.ids.includes(c.id)) s.ids.push(c.id);
    });
  },
});

export default slice.reducer;
