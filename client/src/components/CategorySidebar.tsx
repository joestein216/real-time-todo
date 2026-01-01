import React, { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { createCategory } from '../store/categoriesSlice';
import { setSelectedCategoryId } from '../store/uiSlice';

export default function CategorySidebar() {
  const dispatch = useAppDispatch();
  const cats = useAppSelector(s => s.categories.ids.map(id => s.categories.entities[id]).filter(Boolean));
  const selected = useAppSelector(s => s.ui.selectedCategoryId);
  const [name, setName] = useState('');

  async function onCreate(e: React.FormEvent) {
    e.preventDefault();
    const n = name.trim();
    if (!n) return;
    await dispatch(createCategory({ name: n }));
    setName('');
  }

  return (
    <div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        <button onClick={() => dispatch(setSelectedCategoryId('all'))} aria-pressed={selected === 'all'}>
          All
        </button>
        {cats.map(c => (
          <button key={c.id} onClick={() => dispatch(setSelectedCategoryId(c.id))} aria-pressed={selected === c.id}>
            {c.name}
          </button>
        ))}
      </div>

      <hr />

      <form onSubmit={onCreate} style={{ display: 'flex', gap: 8 }}>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="New category…"
          aria-label="New category name"
        />
        <button type="submit">Add</button>
      </form>
    </div>
  );
}
