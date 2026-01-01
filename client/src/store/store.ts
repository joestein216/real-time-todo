import { configureStore } from '@reduxjs/toolkit';
import todosReducer from './todosSlice';
import categoriesReducer from './categoriesSlice';
import uiReducer from './uiSlice';

export const store = configureStore({
  reducer: {
    todos: todosReducer,
    categories: categoriesReducer,
    ui: uiReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
