import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type StatusFilter = 'all' | 'active' | 'completed';
export type SortBy = 'dueDate' | 'createdAt';
export type SortDir = 'asc' | 'desc';

type UIState = {
  selectedCategoryId: string | 'all';
  statusFilter: StatusFilter;
  sortBy: SortBy;
  sortDir: SortDir;
  todoBoardOrder: string[]; // explicit naming, presentation-only
  transientDeletedIds: string[];
};

const initialState: UIState = {
  selectedCategoryId: 'all',
  statusFilter: 'all',
  sortBy: 'dueDate',
  sortDir: 'asc',
  todoBoardOrder: [],
  transientDeletedIds: [],
};

const slice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setSelectedCategoryId(s, a: PayloadAction<UIState['selectedCategoryId']>) { s.selectedCategoryId = a.payload; },
    setStatusFilter(s, a: PayloadAction<StatusFilter>) { s.statusFilter = a.payload; },
    setSortBy(s, a: PayloadAction<SortBy>) { s.sortBy = a.payload; },
    setSortDir(s, a: PayloadAction<SortDir>) { s.sortDir = a.payload; },
    markDeleted(s, a: PayloadAction<string>) {
      s.transientDeletedIds.push(a.payload);
      // keep bounded
      if (s.transientDeletedIds.length > 25) s.transientDeletedIds.shift();
    },
  },
});

export const { setSelectedCategoryId, setStatusFilter, setSortBy, setSortDir, markDeleted } = slice.actions;
export default slice.reducer;
