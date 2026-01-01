import request from 'supertest';
import express from 'express';
import cors from 'cors';
import { seedDefaultCategory } from '../src/db.js';
import { categoriesRouter } from '../src/routes/categories.js';
import { todosRouter } from '../src/routes/todos.js';

function makeApp() {
  const app = express();
  app.use(cors());
  app.use(express.json());
  seedDefaultCategory();
  app.use('/categories', categoriesRouter());
  app.use('/todos', todosRouter(() => {}));
  return app;
}

describe('todos API', () => {
  it('rejects todo without title', async () => {
    const app = makeApp();
    const categories = await request(app).get('/categories');
    const catId = categories.body[0].id;

    const res = await request(app).post('/todos').send({ description: 'x', categoryId: catId });
    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/title/i);
  });

  it('creates and fetches todo', async () => {
    const app = makeApp();
    const categories = await request(app).get('/categories');
    const catId = categories.body[0].id;

    const created = await request(app).post('/todos').send({ title: 'Hello', categoryId: catId, dueDate: '2026-01-01' });
    expect(created.status).toBe(201);

    const fetched = await request(app).get(`/todos/${created.body.id}`);
    expect(fetched.status).toBe(200);
    expect(fetched.body.title).toBe('Hello');
  });
});
