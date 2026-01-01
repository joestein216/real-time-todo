import type { Category, Todo } from './types';

const API_BASE = import.meta.env.VITE_API_BASE ?? 'http://localhost:4000';

async function json<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    const msg = data?.error ?? `Request failed: ${res.status}`;
    throw new Error(msg);
  }
  return res.json() as Promise<T>;
}

export const api = {
  async getCategories(): Promise<Category[]> {
    return json(await fetch(`${API_BASE}/categories`));
  },
  async createCategory(input: { name: string }): Promise<Category> {
    return json(await fetch(`${API_BASE}/categories`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(input),
    }));
  },

  async getTodos(): Promise<Todo[]> {
    return json(await fetch(`${API_BASE}/todos`));
  },
  async getTodo(id: string): Promise<Todo> {
    return json(await fetch(`${API_BASE}/todos/${id}`));
  },
  async createTodo(input: Partial<Todo> & { title: string; categoryId: string }): Promise<Todo> {
    return json(await fetch(`${API_BASE}/todos`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(input),
    }));
  },
  async updateTodo(id: string, input: Partial<Todo>): Promise<Todo> {
    return json(await fetch(`${API_BASE}/todos/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(input),
    }));
  },
  async deleteTodo(id: string): Promise<void> {
    await json(await fetch(`${API_BASE}/todos/${id}`, { method: 'DELETE' }));
  },
};
