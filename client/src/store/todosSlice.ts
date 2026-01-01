import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { Todo } from '../types';
import { api } from '../api';

type TodosState = {
  entities: Record<string, Todo>;
  ids: string[];
  status: 'idle' | 'loading' | 'error';
  error?: string;
};

const initialState: TodosState = { entities: {}, ids: [], status: 'idle' };

export const fetchTodos = createAsyncThunk('todos/fetchAll', async () => {
  return api.getTodos();
});

export const fetchTodoById = createAsyncThunk('todos/fetchById', async (id: string) => {
  return api.getTodo(id);
});

export const createTodo = createAsyncThunk('todos/create', async (input: { title: string; description?: string; dueDate?: string; categoryId: string }) => {
  return api.createTodo(input);
});

export const updateTodo = createAsyncThunk('todos/update', async (args: { id: string; patch: Partial<Todo> }) => {
  return api.updateTodo(args.id, args.patch);
});

export const deleteTodo = createAsyncThunk('todos/delete', async (id: string) => {
  await api.deleteTodo(id);
  return id;
});

const slice = createSlice({
  name: 'todos',
  initialState,
  reducers: {
    upsertTodo(state, action: PayloadAction<Todo>) {
      const t = action.payload;
      state.entities[t.id] = t;
      if (!state.ids.includes(t.id)) state.ids.push(t.id);
    },
    removeTodo(state, action: PayloadAction<string>) {
      const id = action.payload;
      delete state.entities[id];
      state.ids = state.ids.filter(x => x !== id);
    },
  },
  extraReducers: (b) => {
    b.addCase(fetchTodos.pending, (s) => { s.status = 'loading'; s.error = undefined; });
    b.addCase(fetchTodos.fulfilled, (s, a) => {
      s.status = 'idle';
      s.entities = {};
      s.ids = [];
      for (const t of a.payload) {
        s.entities[t.id] = t;
        s.ids.push(t.id);
      }
    });
    b.addCase(fetchTodos.rejected, (s, a) => { s.status = 'error'; s.error = a.error.message; });

    b.addCase(fetchTodoById.fulfilled, (s, a) => {
      const t = a.payload;
      s.entities[t.id] = t;
      if (!s.ids.includes(t.id)) s.ids.push(t.id);
    });

    b.addCase(createTodo.fulfilled, (s, a) => {
      const t = a.payload;
      s.entities[t.id] = t;
      if (!s.ids.includes(t.id)) s.ids.push(t.id);
    });

    b.addCase(updateTodo.fulfilled, (s, a) => {
      const t = a.payload;
      s.entities[t.id] = t;
      if (!s.ids.includes(t.id)) s.ids.push(t.id);
    });

    b.addCase(deleteTodo.fulfilled, (s, a) => {
      const id = a.payload;
      delete s.entities[id];
      s.ids = s.ids.filter(x => x !== id);
    });
  },
});

export const { upsertTodo, removeTodo } = slice.actions;
export default slice.reducer;
