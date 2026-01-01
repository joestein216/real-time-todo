import React from 'react';
import type { Todo } from '../types';
import { useAppDispatch } from '../store/hooks';
import { updateTodo, deleteTodo } from '../store/todosSlice';

export default function TodoItem({ todo, onEdit }: { todo: Todo; onEdit: () => void }) {
  const dispatch = useAppDispatch();

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '24px 1fr auto', gap: 10, alignItems: 'start', border: '1px solid #444', borderRadius: 8, padding: 10 }}>
      <input
        type="checkbox"
        checked={todo.completed}
        aria-label={todo.completed ? 'Mark incomplete' : 'Mark complete'}
        onChange={() => dispatch(updateTodo({ id: todo.id, patch: { completed: !todo.completed } }))}
      />
      <div>
        <div style={{ display: 'flex', gap: 10, alignItems: 'baseline' }}>
          <strong style={{ textDecoration: todo.completed ? 'line-through' : 'none' }}>{todo.title}</strong>
          {todo.dueDate && <span style={{ opacity: 0.75 }}>due {todo.dueDate}</span>}
        </div>
        {todo.description && <div style={{ opacity: 0.85 }}>{todo.description}</div>}
      </div>

      <div style={{ display: 'flex', gap: 8 }}>
        <button onClick={onEdit}>Edit</button>
        <button onClick={() => dispatch(deleteTodo(todo.id))}>Delete</button>
      </div>
    </div>
  );
}
