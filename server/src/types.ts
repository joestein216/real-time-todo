export type ID = string;

export interface Category {
  id: ID;
  name: string;
  createdAt: string; // ISO
}

export interface Todo {
  id: ID;
  title: string;
  description?: string;
  dueDate?: string; // ISO date or datetime
  categoryId: ID;
  completed: boolean;
  createdAt: string; // ISO
  updatedAt: string; // ISO
}
