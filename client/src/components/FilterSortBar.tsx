import React from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { setSortBy, setSortDir, setStatusFilter } from '../store/uiSlice';

export default function FilterSortBar() {
  const dispatch = useAppDispatch();
  const ui = useAppSelector(s => s.ui);

  return (
    <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap', marginBottom: 12 }}>
      <label>
        Status{' '}
        <select value={ui.statusFilter} onChange={(e) => dispatch(setStatusFilter(e.target.value as any))}>
          <option value="all">All</option>
          <option value="active">Active</option>
          <option value="completed">Completed</option>
        </select>
      </label>

      <label>
        Sort{' '}
        <select value={ui.sortBy} onChange={(e) => dispatch(setSortBy(e.target.value as any))}>
          <option value="dueDate">Due date</option>
          <option value="createdAt">Created date</option>
        </select>
      </label>

      <label>
        Direction{' '}
        <select value={ui.sortDir} onChange={(e) => dispatch(setSortDir(e.target.value as any))}>
          <option value="asc">Asc</option>
          <option value="desc">Desc</option>
        </select>
      </label>
    </div>
  );
}
