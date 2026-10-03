'use client';

import React, { FC } from 'react';
import { ShoppingBag } from 'lucide-react';
import { useOrderStore } from '@/app/store/useOrderStore';
import { useBasketUI } from '@/app/store/useBasketUI';
import { useHydrated } from '@/app/hooks/useHydrated';
import { formatPeso } from '@/app/lib/format';

/**
 * Phone-only bar pinned to the bottom of the shop. It appears once the basket
 * has something in it and replaces the old floating "Order List" button.
 */
export const MobileBasketBar: FC = () => {
  const hydrated = useHydrated();
  const items = useOrderStore((s) => s.items);
  const view = useBasketUI((s) => s.view);
  const open = useBasketUI((s) => s.open);

  const count = items.reduce((sum, i) => sum + i.quantity, 0);
  const total = items.reduce((sum, i) => sum + parseFloat(i.product.price) * i.quantity, 0);
  const visible = hydrated && count > 0 && view === 'closed';

  return (
    <div
      className={`md:hidden fixed left-3 right-3 bottom-4 z-20 transition-[transform,opacity] duration-300 ease-soft ${
        visible ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0 pointer-events-none'
      }`}
      inert={!visible}
    >
      <button
        type="button"
        onClick={open}
        className="w-full flex items-center gap-3 min-h-[60px] pl-[18px] pr-2 rounded-full bg-ink-900 text-white text-left shadow-overlay"
      >
        <ShoppingBag className="w-5 h-5 shrink-0" aria-hidden />
        <span className="flex-1 text-[15px] font-medium">
          {count} {count === 1 ? 'item' : 'items'} · <b className="font-bold tabular-nums">{formatPeso(total)}</b>
        </span>
        <span className="px-[18px] py-3 rounded-full bg-butter-400 text-ink-900 text-[15px] font-semibold">View basket</span>
      </button>
    </div>
  );
};
