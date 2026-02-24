/**
 * useOrderStore — lightweight "cart-lite" order list.
 *
 * Persisted to localStorage so it survives page refresh.
 * Install: npm install zustand
 */
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { OrderItem } from '../lib/order'; 
import { Product } from '../lib/products';

interface OrderStore {
  items: OrderItem[];

  // Actions
  addItem: (product: Product, note?: string) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  updateNote: (productId: string, note: string) => void;
  clearOrder: () => void;

  // Derived helpers (kept as functions to avoid stale reads)
  totalItems: () => number;
  totalPrice: () => number;
  isInOrder: (productId: string) => boolean;
}

export const useOrderStore = create<OrderStore>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (product, note = '') => {
        const existing = get().items.find((i) => i.product.id === product.id);
        if (existing) {
          // Bump quantity if already in list
          set((s) => ({
            items: s.items.map((i) =>
              i.product.id === product.id
                ? { ...i, quantity: i.quantity + 1 }
                : i,
            ),
          }));
        } else {
          set((s) => ({
            items: [...s.items, { product, quantity: 1, note }],
          }));
        }
      },

      removeItem: (productId) =>
        set((s) => ({
          items: s.items.filter((i) => i.product.id !== productId),
        })),

      updateQuantity: (productId, quantity) => {
        if (quantity < 1) {
          get().removeItem(productId);
          return;
        }
        set((s) => ({
          items: s.items.map((i) =>
            i.product.id === productId ? { ...i, quantity } : i,
          ),
        }));
      },

      updateNote: (productId, note) =>
        set((s) => ({
          items: s.items.map((i) =>
            i.product.id === productId ? { ...i, note } : i,
          ),
        })),

      clearOrder: () => set({ items: [] }),

      totalItems: () => get().items.reduce((sum, i) => sum + i.quantity, 0),

      totalPrice: () =>
        get().items.reduce(
          (sum, i) => sum + parseFloat(i.product.price) * i.quantity,
          0,
        ),

      isInOrder: (productId) =>
        get().items.some((i) => i.product.id === productId),
    }),
    {
      name: 'beadcraft-order-list', // localStorage key
    },
  ),
);