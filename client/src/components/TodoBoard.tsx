import React, { useState } from 'react';
import type { Category, Todo } from '../types';
import TodoForm from './TodoForm';
import TodoItem from './TodoItem';

export default function TodoBoard(props: { categories: Category[]; grouped: Record<string, Todo[]> }) {
  const { categories, grouped } = props;
  const [editing, setEditing] = useState<Todo | null>(null);

  return (
    <div style={{ display: 'grid', gap: 12 }}>
      <TodoForm mode="create" onDone={() => {}} />

      {categories.map(c => (
        <section key={c.id} style={{ borderTop: '1px solid #333', paddingTop: 10 }}>
          <h3 style={{ margin: '6px 0' }}>{c.name}</h3>
          <div style={{ display: 'grid', gap: 8 }}>
            {(grouped[c.id] ?? []).map(t => (
              <TodoItem key={t.id} todo={t} onEdit={() => setEditing(t)} />
            ))}
            {(grouped[c.id] ?? []).length === 0 && <p style={{ opacity: 0.7 }}>No todos in this category.</p>}
          </div>
        </section>
      ))}

      {editing && (
        <div style={{ border: '1px dashed #666', padding: 12, borderRadius: 8 }}>
          <h3>Edit</h3>
          <TodoForm mode="edit" todo={editing} onDone={() => setEditing(null)} />
        </div>
      )}
    </div>
  );
}
