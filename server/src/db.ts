import { Category, Todo, ID } from './types.js';

export const db = {
  todos: new Map<ID, Todo>(),
  categories: new Map<ID, Category>(),
};

// seed: default "General"
export function seedDefaultCategory() {
  const existing = Array.from(db.categories.values()).find(c => c.name.toLowerCase() === 'general');
  if (existing) return existing;
  const now = new Date().toISOString();
  const general: Category = { id: 'cat_general', name: 'General', createdAt: now };
  db.categories.set(general.id, general);
  return general;
}
