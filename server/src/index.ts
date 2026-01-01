import express from 'express';
import cors from 'cors';
import http from 'http';
import { Server as SocketIOServer } from 'socket.io';
import { seedDefaultCategory } from './db.js';
import { categoriesRouter } from './routes/categories.js';
import { todosRouter } from './routes/todos.js';

const PORT = process.env.PORT ? Number(process.env.PORT) : 4000;

const app = express();
app.use(cors({ origin: true }));
app.use(express.json());

// seed default category
seedDefaultCategory();

// http + socket.io
const server = http.createServer(app);
const io = new SocketIOServer(server, {
  cors: { origin: true },
});

io.on('connection', (socket) => {
  socket.emit('hello', { ok: true });
});

const emit = (event: string, payload: any) => io.emit(event, payload);

// routes
app.get('/health', (_req, res) => res.json({ ok: true }));
app.use('/categories', categoriesRouter());
app.use('/todos', todosRouter(emit));

server.listen(PORT, () => {
  console.log(`API listening on http://localhost:${PORT}`);
});
