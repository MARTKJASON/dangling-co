'use client';

import React, { FC } from 'react';
import { ShoppingBag } from 'lucide-react';
import { useOrderStore } from '@/app/store/useOrderStore';
import { useBasketUI } from '@/app/store/useBasketUI';
import { useHydrated } from '@/app/hooks/useHydrated';

export const CountBadge: FC<{ count: number; className?: string }> = ({ count, className = '' }) => (
  // Keyed on count so the bump animation replays whenever the number changes.
  <span
    key={count}
    className={`inline-flex items-center justify-center min-w-[22px] h-[22px] px-1.5 rounded-full bg-butter-400 text-ink-900 text-xs font-bold tabular-nums animate-bump ${className}`}
  >
    {count}
  </span>
);

/** Header basket control: a labelled pill on desktop, an icon with a badge on phones. */
export const BasketButton: FC = () => {
  const hydrated = useHydrated();
  const count = useOrderStore((s) => s.items.reduce((sum, i) => sum + i.quantity, 0));
  const open = useBasketUI((s) => s.open);
  const shown = hydrated ? count : 0;
  const label = `Basket, ${shown} ${shown === 1 ? 'item' : 'items'}`;

  return (
    <>
      <button type="button" onClick={open} aria-label={label} className="btn btn-secondary btn-sm hidden md:inline-flex !min-h-11 gap-2.5">
        <ShoppingBag className="w-[18px] h-[18px]" aria-hidden />
        Basket
        {shown > 0 && <CountBadge count={shown} />}
      </button>
      <button type="button" onClick={open} aria-label={label} className="icon-btn relative md:hidden">
        <ShoppingBag className="w-[22px] h-[22px]" aria-hidden />
        {shown > 0 && <CountBadge count={shown} className="absolute top-0.5 right-0 !min-w-[18px] !h-[18px] text-[11px] px-1" />}
      </button>
    </>
  );
};
