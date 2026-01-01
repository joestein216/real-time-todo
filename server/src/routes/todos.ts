import { Router } from 'express';
import { v4 as uuid } from 'uuid';
import { db } from '../db.js';
import { Todo } from '../types.js';
import { validateTodoInput } from '../validation.js';

type EmitFn = (event: string, payload: any) => void;

export function todosRouter(emit: EmitFn) {
  const r = Router();

  r.get('/', (_req, res) => {
    res.json(Array.from(db.todos.values()));
  });

  r.get('/:id', (req, res) => {
    const todo = db.todos.get(req.params.id);
    if (!todo) return res.status(404).json({ error: 'Todo not found.' });
    res.json(todo);
  });

  r.post('/', (req, res) => {
    const v = validateTodoInput(req.body);
    if (!v.ok) return res.status(v.status).json({ error: v.message });

    const now = new Date().toISOString();
    const todo: Todo = {
      id: uuid(),
      title: v.value.title,
      description: v.value.description,
      dueDate: v.value.dueDate,
      categoryId: v.value.categoryId,
      completed: v.value.completed ?? false,
      createdAt: now,
      updatedAt: now,
    };
    db.todos.set(todo.id, todo);
    emit('todo:created', { id: todo.id });
    res.status(201).json(todo);
  });

  r.put('/:id', (req, res) => {
    const id = req.params.id;
    const existing = db.todos.get(id);
    if (!existing) return res.status(404).json({ error: 'Todo not found.' });

    const v = validateTodoInput({ ...existing, ...req.body, categoryId: req.body?.categoryId ?? existing.categoryId });
    if (!v.ok) return res.status(v.status).json({ error: v.message });

    const updated: Todo = {
      ...existing,
      title: v.value.title,
      description: v.value.description,
      dueDate: v.value.dueDate,
      categoryId: v.value.categoryId,
      completed: v.value.completed ?? existing.completed,
      updatedAt: new Date().toISOString(),
    };
    db.todos.set(id, updated);
    emit('todo:updated', { id });
    res.json(updated);
  });

  r.delete('/:id', (req, res) => {
    const id = req.params.id;
    if (!db.todos.has(id)) return res.status(404).json({ error: 'Todo not found.' });
    db.todos.delete(id);
    emit('todo:deleted', { id });
    res.status(204).end();
  });

  return r;
}
