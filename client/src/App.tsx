import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from './store/hooks';
import { fetchCategories } from './store/categoriesSlice';
import { fetchTodos } from './store/todosSlice';
import { selectTodosGroupedByCategory } from './store/selectors';
import CategorySidebar from './components/CategorySidebar';
import FilterSortBar from './components/FilterSortBar';
import TodoBoard from './components/TodoBoard';

const container: React.CSSProperties = { display: 'grid', gridTemplateColumns: '260px 1fr', gap: 16, padding: 16, fontFamily: 'system-ui, -apple-system, Segoe UI, Roboto, sans-serif' };
const card: React.CSSProperties = { border: '1px solid #333', borderRadius: 8, padding: 12 };

export default function App() {
  const dispatch = useAppDispatch();
  const { categories, grouped } = useAppSelector(selectTodosGroupedByCategory);
  const todosStatus = useAppSelector(s => s.todos.status);
  const catsStatus = useAppSelector(s => s.categories.status);
  const error = useAppSelector(s => s.todos.error ?? s.categories.error);

  useEffect(() => {
    dispatch(fetchCategories());
    dispatch(fetchTodos());
  }, [dispatch]);

  return (
    <div style={container}>
      <div style={card}>
        <h2 style={{ marginTop: 0 }}>Categories</h2>
        <CategorySidebar />
      </div>

      <div style={card}>
        <h1 style={{ marginTop: 0 }}>Todos</h1>
        <FilterSortBar />
        {(todosStatus === 'loading' || catsStatus === 'loading') && <p>Loading…</p>}
        {error && <p role="alert" style={{ color: 'crimson' }}>{error}</p>}
        <TodoBoard categories={categories} grouped={grouped} />
      </div>
    </div>
  );
}
