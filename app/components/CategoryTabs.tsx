import React, { FC } from 'react';
import { CATEGORIES } from '../lib/categories';
import type { Category } from '../lib/products';

export type { Category };

interface CategoryTabsProps {
  /** null = "All". */
  active: Category | null;
  onChange: (category: Category | null) => void;
  /** Optional item counts per category, shown next to each label. */
  counts?: Partial<Record<Category | 'all', number>>;
}

/** Category filter chips. Scrolls horizontally on phones. */
const CategoryTabs: FC<CategoryTabsProps> = ({ active, onChange, counts }) => {
  const options: { id: Category | null; label: string; count?: number }[] = [
    { id: null, label: 'All', count: counts?.all },
    ...CATEGORIES.map((c) => ({ id: c.id, label: c.label, count: counts?.[c.id] })),
  ];

  return (
    <div role="group" aria-label="Category" className="flex gap-2 overflow-x-auto no-scrollbar -mx-4 px-4 md:mx-0 md:px-0 py-0.5">
      {options.map((o) => (
        <button
          key={o.label}
          type="button"
          className="chip"
          aria-pressed={active === o.id}
          onClick={() => onChange(o.id)}
        >
          {o.label}
          {o.count !== undefined && <span className="font-medium opacity-70 tabular-nums">{o.count}</span>}
        </button>
      ))}
    </div>
  );
};

export default CategoryTabs;
