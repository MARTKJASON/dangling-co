import { useCallback, useEffect, useRef, useState } from 'react';
import { useOrderStore } from '../store/useOrderStore';
import { useBasketUI } from '../store/useBasketUI';
import { useToast } from '../store/useToast';
import { Product } from '../lib/products';

export type AddPhase = 'idle' | 'adding' | 'added';

/**
 * Adds a product to the basket with the approved feedback sequence:
 * a short "Adding…" beat, then "Added" for ~1.6s, plus a toast with a View action.
 */
export const useAddToBasket = () => {
  const addItem = useOrderStore((s) => s.addItem);
  const openBasket = useBasketUI((s) => s.open);
  const showToast = useToast((s) => s.show);
  const [phase, setPhase] = useState<AddPhase>('idle');
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  const add = useCallback(
    (product: Product, note = '', quantity = 1) => {
      if (phase !== 'idle') return;
      setPhase('adding');
      timers.current.push(
        setTimeout(() => {
          addItem(product, note.trim(), quantity);
          setPhase('added');
          showToast('Added to your basket', { action: { label: 'View', onClick: openBasket } });
        }, 350),
        setTimeout(() => setPhase('idle'), 2000),
      );
    },
    [phase, addItem, showToast, openBasket],
  );

  return { add, phase };
};
