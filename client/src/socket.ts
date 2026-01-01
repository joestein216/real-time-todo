import { io, Socket } from 'socket.io-client';
import { store } from './store/store';
import { fetchTodoById, removeTodo } from './store/todosSlice';
import { markDeleted } from './store/uiSlice';

const API_BASE = import.meta.env.VITE_API_BASE ?? 'http://localhost:4000';

let socket: Socket | null = null;

export function connectSocket() {
  if (socket) return socket;
  socket = io(API_BASE);

  socket.on('todo:created', ({ id }) => {
    store.dispatch(fetchTodoById(id));
  });

  socket.on('todo:updated', ({ id }) => {
    store.dispatch(fetchTodoById(id));
  });

  socket.on('todo:deleted', ({ id }) => {
    store.dispatch(removeTodo(id));
    store.dispatch(markDeleted(id));
  });

  return socket;
}
