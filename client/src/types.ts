export type ID = string;

export interface Category {
  id: ID;
  name: string;
  createdAt: string;
}

export interface Todo {
  id: ID;
  title: string;
  description?: string;
  dueDate?: string;
  categoryId: ID;
  completed: boolean;
  createdAt: string;
  updatedAt: string;
}
