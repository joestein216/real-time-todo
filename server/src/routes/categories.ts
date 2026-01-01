import { Router } from 'express';
import { v4 as uuid } from 'uuid';
import { db } from '../db.js';
import { Category } from '../types.js';
import { validateCategoryInput } from '../validation.js';

export function categoriesRouter() {
  const r = Router();

  r.get('/', (_req, res) => {
    res.json(Array.from(db.categories.values()));
  });

  r.post('/', (req, res) => {
    const v = validateCategoryInput(req.body);
    if (!v.ok) return res.status(v.status).json({ error: v.message });

    const now = new Date().toISOString();
    const cat: Category = { id: uuid(), name: v.value.name, createdAt: now };
    db.categories.set(cat.id, cat);
    res.status(201).json(cat);
  });

  r.put('/:id', (req, res) => {
    const id = req.params.id;
    const existing = db.categories.get(id);
    if (!existing) return res.status(404).json({ error: 'Category not found.' });

    const name = typeof req.body?.name === 'string' ? req.body.name.trim() : '';
    if (!name) return res.status(400).json({ error: 'Category name is required.' });

    const dup = Array.from(db.categories.values()).find(c => c.id !== id && c.name.toLowerCase() === name.toLowerCase());
    if (dup) return res.status(409).json({ error: 'Category name already exists.' });

    const updated: Category = { ...existing, name };
    db.categories.set(id, updated);
    res.json(updated);
  });

  r.delete('/:id', (req, res) => {
    const id = req.params.id;
    if (!db.categories.has(id)) return res.status(404).json({ error: 'Category not found.' });

    // Guard: do not allow delete if any todo references it
    const inUse = Array.from(db.todos.values()).some(t => t.categoryId === id);
    if (inUse) return res.status(409).json({ error: 'Category is in use by existing todos.' });

    db.categories.delete(id);
    res.status(204).end();
  });

  return r;
}
