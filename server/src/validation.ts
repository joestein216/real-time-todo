import { db } from './db.js';

export type ValidationResult<T> = { ok: true; value: T } | { ok: false; status: number; message: string };

export function isIsoString(s: string): boolean {
  const d = new Date(s);
  return !Number.isNaN(d.getTime()) && s.includes('T');
}

export function isIsoDateString(s: string): boolean {
  // YYYY-MM-DD accepted
  return /^\d{4}-\d{2}-\d{2}$/.test(s) || isIsoString(s);
}

export function validateCategoryInput(body: any): ValidationResult<{ name: string }> {
  const name = typeof body?.name === 'string' ? body.name.trim() : '';
  if (!name) return { ok: false, status: 400, message: 'Category name is required.' };
  const dup = Array.from(db.categories.values()).find(c => c.name.toLowerCase() === name.toLowerCase());
  if (dup) return { ok: false, status: 409, message: 'Category name already exists.' };
  return { ok: true, value: { name } };
}

export function validateTodoInput(body: any): ValidationResult<{
  title: string;
  description?: string;
  dueDate?: string;
  categoryId: string;
  completed?: boolean;
}> {
  const title = typeof body?.title === 'string' ? body.title.trim() : '';
  if (!title) return { ok: false, status: 400, message: 'Todo title is required.' };

  const description = typeof body?.description === 'string' ? body.description.trim() : undefined;

  const categoryId = typeof body?.categoryId === 'string' ? body.categoryId : '';
  if (!categoryId) return { ok: false, status: 400, message: 'categoryId is required.' };
  if (!db.categories.has(categoryId)) return { ok: false, status: 400, message: 'categoryId does not exist.' };

  const dueDate = typeof body?.dueDate === 'string' ? body.dueDate : undefined;
  if (dueDate && !isIsoDateString(dueDate)) return { ok: false, status: 400, message: 'dueDate must be an ISO date (YYYY-MM-DD) or ISO datetime.' };

  const completed = typeof body?.completed === 'boolean' ? body.completed : undefined;

  return { ok: true, value: { title, description, dueDate, categoryId, completed } };
}
