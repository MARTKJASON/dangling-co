/**
 * useBasketUI — open/closed state for the basket panel, shared by the header
 * button, the mobile basket bar, toasts and the panel itself.
 *
 * Not persisted: the panel always starts closed.
 */
import { create } from 'zustand';

export type BasketView = 'closed' | 'basket' | 'send';

interface BasketUIStore {
  view: BasketView;
  open: () => void;
  close: () => void;
  showSend: () => void;
  showBasket: () => void;
}

export const useBasketUI = create<BasketUIStore>()((set) => ({
  view: 'closed',
  open: () => set({ view: 'basket' }),
  close: () => set({ view: 'closed' }),
  showSend: () => set({ view: 'send' }),
  showBasket: () => set({ view: 'basket' }),
}));
