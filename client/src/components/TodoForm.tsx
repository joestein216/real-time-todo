import React, { useMemo, useState } from 'react';
import type { Todo } from '../types';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { createTodo, updateTodo } from '../store/todosSlice';

export default function TodoForm(props: { mode: 'create' | 'edit'; todo?: Todo; onDone: () => void }) {
  const dispatch = useAppDispatch();
  const cats = useAppSelector(s => s.categories.ids.map(id => s.categories.entities[id]).filter(Boolean));
  const defaultCat = cats[0]?.id ?? 'cat_general';

  const initial = useMemo(() => {
    if (props.mode === 'edit' && props.todo) return props.todo;
    return null;
  }, [props.mode, props.todo]);

  const [title, setTitle] = useState(initial?.title ?? '');
  const [description, setDescription] = useState(initial?.description ?? '');
  const [dueDate, setDueDate] = useState(initial?.dueDate ?? '');
  const [categoryId, setCategoryId] = useState(initial?.categoryId ?? defaultCat);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    try {
      if (props.mode === 'create') {
        await dispatch(createTodo({ title: title.trim(), description: description.trim() || undefined, dueDate: dueDate || undefined, categoryId })).unwrap();
        setTitle(''); setDescription(''); setDueDate('');
      } else if (props.todo) {
        await dispatch(updateTodo({ id: props.todo.id, patch: { title: title.trim(), description: description.trim() || undefined, dueDate: dueDate || undefined, categoryId } })).unwrap();
        props.onDone();
      }
    } catch (e: any) {
      setError(e?.message ?? 'Failed');
    }
  }

  return (
    <form onSubmit={onSubmit} style={{ display: 'grid', gap: 8, marginBottom: 10 }}>
      <div style={{ display: 'grid', gap: 8, gridTemplateColumns: '1fr 220px 180px' }}>
        <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Todo title" aria-label="Todo title" />
        <select value={categoryId} onChange={(e) => setCategoryId(e.target.value)} aria-label="Category">
          {cats.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
        <input value={dueDate} onChange={(e) => setDueDate(e.target.value)} placeholder="Due date (YYYY-MM-DD)" aria-label="Due date" />
      </div>
      <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Description (optional)" aria-label="Description" />
      {error && <div role="alert" style={{ color: 'crimson' }}>{error}</div>}
      <div>
        <button type="submit">{props.mode === 'create' ? 'Add todo' : 'Save changes'}</button>
        {props.mode === 'edit' && <button type="button" onClick={props.onDone} style={{ marginLeft: 8 }}>Cancel</button>}
      </div>
    </form>
  );
}
