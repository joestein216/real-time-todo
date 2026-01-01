import todosReducer, { upsertTodo } from '../src/store/todosSlice';
import type { Todo } from '../src/types';

test('upsertTodo adds todo', () => {
  const t: Todo = {
    id: 't1',
    title: 'A',
    categoryId: 'cat_general',
    completed: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  const state = todosReducer(undefined, upsertTodo(t));
  expect(state.entities.t1.title).toBe('A');
});
