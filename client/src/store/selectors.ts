import type { RootState } from './store';
import type { Todo } from '../types';

export function selectCategories(state: RootState) {
  return state.categories.ids.map(id => state.categories.entities[id]).filter(Boolean);
}

export function selectTodos(state: RootState) {
  return state.todos.ids.map(id => state.todos.entities[id]).filter(Boolean);
}

export function selectVisibleTodos(state: RootState): Todo[] {
  const { statusFilter, sortBy, sortDir, selectedCategoryId } = state.ui;
  let todos = selectTodos(state);

  if (selectedCategoryId !== 'all') {
    todos = todos.filter(t => t.categoryId === selectedCategoryId);
  }

  if (statusFilter === 'active') todos = todos.filter(t => !t.completed);
  if (statusFilter === 'completed') todos = todos.filter(t => t.completed);

  const toKey = (t: Todo): number => {
    if (sortBy === 'createdAt') return new Date(t.createdAt).getTime();
    if (!t.dueDate) return Number.POSITIVE_INFINITY; // push undated to end
    return new Date(t.dueDate).getTime();
  };

  todos = [...todos].sort((a, b) => {
    const ka = toKey(a);
    const kb = toKey(b);
    const diff = ka - kb;
    return sortDir === 'asc' ? diff : -diff;
  });

  return todos;
}

export function selectTodosGroupedByCategory(state: RootState) {
  const cats = selectCategories(state);
  const todos = selectVisibleTodos(state);

  const grouped: Record<string, Todo[]> = {};
  for (const c of cats) grouped[c.id] = [];
  for (const t of todos) {
    grouped[t.categoryId] ??= [];
    grouped[t.categoryId].push(t);
  }
  return { categories: cats, grouped };
}
