/**
 * useToast — a tiny global toast queue. Toasts clear themselves after 3s.
 */
import { create } from 'zustand';

export type ToastTone = 'success' | 'error';

export interface ToastAction {
  label: string;
  onClick: () => void;
}

export interface Toast {
  id: number;
  tone: ToastTone;
  message: string;
  action?: ToastAction;
}

interface ToastStore {
  toasts: Toast[];
  show: (message: string, options?: { tone?: ToastTone; action?: ToastAction }) => void;
  dismiss: (id: number) => void;
}

const TOAST_DURATION_MS = 3000;
let nextId = 1;

export const useToast = create<ToastStore>()((set, get) => ({
  toasts: [],
  show: (message, options = {}) => {
    const id = nextId++;
    const toast: Toast = { id, message, tone: options.tone ?? 'success', action: options.action };
    // Keep at most two on screen so they never pile up over the content.
    set((s) => ({ toasts: [...s.toasts.slice(-1), toast] }));
    setTimeout(() => get().dismiss(id), TOAST_DURATION_MS);
  },
  dismiss: (id) => set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),
}));
