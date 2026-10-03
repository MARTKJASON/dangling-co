'use client';

import React, { FC, useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { ChevronLeft, Copy, Check, Loader2, MessageCircle, Plus, ShoppingBag, Trash2, X } from 'lucide-react';
import { useOrderStore } from '@/app/store/useOrderStore';
import { useBasketUI } from '@/app/store/useBasketUI';
import { useToast } from '@/app/store/useToast';
import { useHydrated } from '@/app/hooks/useHydrated';
import { createOrder } from '@/app/lib/createOrder';
import { OrderItem } from '@/app/lib/order';
import { buildOrderMessage, copyToClipboard, MESSENGER_URL } from '@/app/lib/orderMessage';
import { formatPeso } from '@/app/lib/format';
import { QuantityStepper } from '../ui/QuantityStepper';

interface CreatedOrder {
  ref: string;
  items: OrderItem[];
  totalPrice: number;
  /** Serialized basket the order was created from, so going Back and Continue again reuses it. */
  signature: string;
}

const basketSignature = (items: OrderItem[]) =>
  JSON.stringify(items.map((i) => [i.product.id, i.quantity, i.note.trim()]));

/**
 * The basket. A bottom sheet on phones and a 440px right-hand panel on desktop.
 * It has two views in one surface: the basket itself, then "send it on Messenger".
 */
export const BasketPanel: FC = () => {
  const hydrated = useHydrated();
  const view = useBasketUI((s) => s.view);
  const close = useBasketUI((s) => s.close);
  const isOpen = hydrated && view !== 'closed';

  const panelRef = useRef<HTMLDivElement>(null);
  const returnFocusRef = useRef<HTMLElement | null>(null);

  // Focus management, Esc to close, and no background scrolling while open.
  useEffect(() => {
    if (!isOpen) return;
    // An 'Added' toast would sit on top of the basket's buttons; the basket itself confirms it.
    useToast.setState({ toasts: [] });
    returnFocusRef.current = document.activeElement as HTMLElement | null;
    const t = setTimeout(() => panelRef.current?.querySelector<HTMLElement>('[data-autofocus]')?.focus(), 50);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
    };
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKey);
    return () => {
      clearTimeout(t);
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
      returnFocusRef.current?.focus?.();
    };
  }, [isOpen, close]);

  return (
    <>
      <div
        aria-hidden
        onClick={close}
        className={`fixed inset-0 z-40 bg-ink-900/40 transition-opacity duration-300 ease-soft ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label={view === 'send' ? 'Send your order' : 'Your basket'}
        inert={!isOpen}
        className={`fixed z-50 bg-white flex flex-col overflow-hidden shadow-overlay transition-[transform,visibility] duration-300 ease-soft
          inset-x-0 bottom-0 max-h-[88dvh] rounded-t-sheet
          md:inset-x-auto md:right-0 md:top-0 md:bottom-0 md:max-h-none md:w-[440px] md:rounded-none
          ${isOpen ? 'visible translate-y-0 md:translate-x-0' : 'invisible translate-y-[105%] md:translate-y-0 md:translate-x-[105%]'}`}
      >
        {hydrated && (view === 'send' ? <SendView /> : <BasketView />)}
      </div>
    </>
  );
};

// ─── View 1: the basket ────────────────────────────────────────────────────
const BasketView: FC = () => {
  const { items, removeItem, updateQuantity, updateNote, clearOrder } = useOrderStore();
  const close = useBasketUI((s) => s.close);
  const showSend = useBasketUI((s) => s.showSend);
  const showToast = useToast((s) => s.show);
  const { pending, setPending } = useCreatedOrder();
  const [submitting, setSubmitting] = useState(false);
  const [confirmEmpty, setConfirmEmpty] = useState(false);

  const count = items.reduce((sum, i) => sum + i.quantity, 0);
  const total = items.reduce((sum, i) => sum + parseFloat(i.product.price) * i.quantity, 0);

  const handleContinue = async () => {
    if (items.length === 0) return;
    const signature = basketSignature(items);
    if (pending?.signature === signature) {
      showSend();
      return;
    }
    setSubmitting(true);
    try {
      const snapshot = items.map((i) => ({ ...i }));
      const { ref } = await createOrder(snapshot);
      setPending({ ref, items: snapshot, totalPrice: total, signature });
      showSend();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Something went wrong.';
      showToast(`Couldn’t create your order. ${message}`, { tone: 'error' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <div className="mx-auto mt-2.5 w-10 h-[5px] rounded-full bg-cream-300 md:hidden" aria-hidden />
      <div className="flex items-center pl-5 md:pl-7 pr-2 md:pr-4 pt-1.5 md:pt-4 pb-2.5 md:pb-4 border-b border-cream-200">
        <h2 className="flex-1 font-display text-2xl md:text-[26px] font-semibold">
          Your basket
          {count > 0 && <span className="font-sans text-[15px] font-medium text-ink-600"> · {count} {count === 1 ? 'item' : 'items'}</span>}
        </h2>
        <button type="button" onClick={close} aria-label="Close basket" className="icon-btn" data-autofocus>
          <X className="w-5 h-5" aria-hidden />
        </button>
      </div>

      {items.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center text-center gap-2.5 px-6 py-14">
          <span className="w-16 h-16 rounded-full bg-peri-50 text-peri-600 flex items-center justify-center">
            <ShoppingBag className="w-7 h-7" strokeWidth={1.8} aria-hidden />
          </span>
          <p className="font-display text-[22px] font-semibold">Your basket is empty</p>
          <p className="text-[15px] text-ink-600 max-w-[260px]">Find something you love and it’ll wait for you here.</p>
          <Link href="/shop" onClick={close} className="btn btn-secondary mt-2">
            Browse the shop
          </Link>
        </div>
      ) : (
        <>
          <ul className="flex-1 overflow-y-auto px-5 md:px-7 py-2">
            {items.map((item) => (
              <BasketLine
                key={item.product.id}
                item={item}
                onQuantity={(q) => updateQuantity(item.product.id, q)}
                onRemove={() => removeItem(item.product.id)}
                onNote={(n) => updateNote(item.product.id, n)}
              />
            ))}
          </ul>

          <div className="px-5 md:px-7 pt-4 pb-6 md:pb-7 border-t border-cream-300 flex flex-col gap-2.5">
            <div className="flex justify-between items-baseline">
              <span className="font-semibold">Total</span>
              <span className="text-[22px] md:text-2xl font-bold tabular-nums">{formatPeso(total)}</span>
            </div>
            <p className="text-[13px] text-ink-600 -mt-1.5">Delivery and any custom details are confirmed with you on Messenger.</p>
            <button type="button" onClick={handleContinue} disabled={submitting} className="btn btn-messenger btn-lg mt-1.5">
              {submitting ? (
                <><Loader2 className="w-5 h-5 animate-spin" aria-hidden /> Preparing your order…</>
              ) : (
                <><MessageCircle className="w-5 h-5" aria-hidden /> Continue to Messenger</>
              )}
            </button>
            {confirmEmpty ? (
              <div className="flex items-center justify-center gap-2 min-h-11 text-[15px]">
                <span className="text-ink-600">Remove everything?</span>
                <button type="button" onClick={() => { clearOrder(); setConfirmEmpty(false); }} className="btn btn-danger btn-sm">Yes, empty it</button>
                <button type="button" onClick={() => setConfirmEmpty(false)} className="btn btn-ghost btn-sm">Keep</button>
              </div>
            ) : (
              <button type="button" onClick={() => setConfirmEmpty(true)} disabled={submitting} className="btn btn-ghost !text-ink-600 hover:!text-cherry-700 hover:!bg-cherry-100">
                Empty basket
              </button>
            )}
          </div>
        </>
      )}
    </>
  );
};

interface BasketLineProps {
  item: OrderItem;
  onQuantity: (quantity: number) => void;
  onRemove: () => void;
  onNote: (note: string) => void;
}

const BasketLine: FC<BasketLineProps> = ({ item, onQuantity, onRemove, onNote }) => {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(item.note);
  const noteId = `note-${item.product.id}`;
  const lineTotal = parseFloat(item.product.price) * item.quantity;

  const saveNote = () => {
    onNote(draft.trim());
    setEditing(false);
  };

  return (
    <li className="flex gap-3.5 md:gap-4 py-4 border-b border-cream-200 last:border-b-0">
      <img src={item.product.image_url} alt="" className="w-[72px] h-[88px] md:w-20 md:h-[100px] rounded-xl object-cover shrink-0 bg-cream-200" />
      <div className="flex-1 min-w-0 flex flex-col gap-1">
        <div className="flex justify-between gap-2">
          <Link href={`/product/${item.product.id}`} className="font-semibold leading-snug hover:text-peri-700 line-clamp-2">
            {item.product.name}
          </Link>
          <span className="font-bold tabular-nums whitespace-nowrap">{formatPeso(lineTotal)}</span>
        </div>

        {editing ? (
          <div className="flex flex-col gap-2 mt-1">
            <label htmlFor={noteId} className="sr-only">Note for {item.product.name}</label>
            <textarea
              id={noteId}
              rows={2}
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder="Colors, letters, size…"
              className="field !min-h-0 !py-2 resize-none"
              autoFocus
            />
            <div className="flex gap-1">
              <button type="button" onClick={saveNote} className="btn btn-primary btn-sm">Save note</button>
              <button type="button" onClick={() => { setDraft(item.note); setEditing(false); }} className="btn btn-ghost btn-sm">Cancel</button>
            </div>
          </div>
        ) : item.note.trim() ? (
          <p className="text-sm text-ink-600">
            Note: {item.note}{' '}·{' '}
            <button type="button" onClick={() => setEditing(true)} className="font-semibold text-peri-700 underline underline-offset-2 hover:text-ink-900">
              Edit
            </button>
          </p>
        ) : (
          <button type="button" onClick={() => setEditing(true)} className="self-start inline-flex items-center gap-1 py-0.5 text-sm font-semibold text-peri-700 hover:text-ink-900">
            <Plus className="w-3.5 h-3.5" strokeWidth={2.4} aria-hidden /> Add a note
          </button>
        )}

        <div className="flex items-center justify-between mt-1.5">
          <QuantityStepper value={item.quantity} onChange={onQuantity} label={item.product.name} min={1} />
          <button type="button" onClick={onRemove} aria-label={`Remove ${item.product.name}`} className="icon-btn !text-ink-600 hover:!text-cherry-700">
            <Trash2 className="w-5 h-5" aria-hidden />
          </button>
        </div>
      </div>
    </li>
  );
};

// ─── View 2: send it on Messenger ──────────────────────────────────────────
const SendView: FC = () => {
  const close = useBasketUI((s) => s.close);
  const showBasket = useBasketUI((s) => s.showBasket);
  const clearOrder = useOrderStore((s) => s.clearOrder);
  const { pending, setPending } = useCreatedOrder();
  const [copied, setCopied] = useState(false);

  const message = useMemo(
    () => (pending ? buildOrderMessage(pending.ref, pending.items, pending.totalPrice) : ''),
    [pending],
  );

  if (!pending) {
    // Nothing to send (e.g. state was reset) — fall back to the basket.
    return <BasketView />;
  }

  const count = pending.items.reduce((sum, i) => sum + i.quantity, 0);

  const handleCopyAndOpen = () => {
    // Copy and open within the same tap so mobile browsers don't block the new tab.
    copyToClipboard(message);
    window.open(MESSENGER_URL, '_blank', 'noopener,noreferrer');
    setCopied(true);
    clearOrder();
  };

  const handleCopyOnly = () => {
    copyToClipboard(message);
    setCopied(true);
  };

  const handleClose = () => {
    if (copied) setPending(null);
    close();
  };

  return (
    <>
      <div className="flex items-center gap-1 pl-2 md:pl-3 pr-2 md:pr-4 pt-3 md:pt-4 pb-2">
        {copied ? (
          <span className="flex-1" />
        ) : (
          <>
            <button type="button" onClick={showBasket} aria-label="Back to basket" className="icon-btn" data-autofocus>
              <ChevronLeft className="w-5 h-5" aria-hidden />
            </button>
            <span className="flex-1 text-[15px] font-semibold text-ink-600">Back to basket</span>
          </>
        )}
        <button type="button" onClick={handleClose} aria-label="Close" className="icon-btn" data-autofocus={copied ? true : undefined}>
          <X className="w-5 h-5" aria-hidden />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-5 md:px-7 py-2 flex flex-col gap-5 animate-fade-in">
        <div className="flex flex-col gap-2">
          <span className="self-start px-3 py-1 rounded-full bg-peri-50 text-peri-800 text-[13px] font-semibold tracking-wide">
            Order {pending.ref}
          </span>
          <h2 className="font-display text-[28px] md:text-[30px] leading-[1.12] font-semibold">
            {copied ? 'Message copied. Now paste it in Messenger.' : 'One last step: send it to us on Messenger.'}
          </h2>
        </div>

        <ol className="flex flex-col gap-3">
          {[
            'Tap the button. We copy your order message.',
            'Messenger opens. Paste the message and send.',
            'We reply to confirm details and delivery.',
          ].map((step, i) => (
            <li key={step} className="flex gap-3 items-start">
              <span className="w-7 h-7 shrink-0 rounded-full bg-peri-600 text-white text-sm font-bold flex items-center justify-center">{i + 1}</span>
              <span className="text-[15px] pt-0.5">{step}</span>
            </li>
          ))}
        </ol>

        <div className="rounded-[18px] bg-cream-100 p-4 flex flex-col gap-2">
          <div className="flex justify-between items-center">
            <span className="eyebrow">Your message</span>
            <span className="text-[13px] text-ink-600">{count} {count === 1 ? 'item' : 'items'} · {formatPeso(pending.totalPrice)}</span>
          </div>
          <pre className="font-sans text-sm leading-relaxed whitespace-pre-wrap text-ink-900">{message}</pre>
        </div>
      </div>

      <div className="px-5 md:px-7 pt-4 pb-6 md:pb-7 border-t border-cream-300 flex flex-col gap-2.5">
        <button type="button" onClick={handleCopyAndOpen} className={`btn btn-lg ${copied ? 'btn-success' : 'btn-messenger'}`}>
          {copied ? (
            <><Check className="w-5 h-5" aria-hidden /> Copied! Open Messenger again</>
          ) : (
            <><Copy className="w-5 h-5" aria-hidden /> Copy message &amp; open Messenger</>
          )}
        </button>
        <p className="text-center text-[13px] text-ink-600">
          Messenger didn’t open?{' '}
          <button type="button" onClick={handleCopyOnly} className="font-semibold text-peri-700 underline underline-offset-2">
            Copy the message
          </button>{' '}
          and open it yourself.
        </p>
      </div>
    </>
  );
};

// ─── Shared bits ───────────────────────────────────────────────────────────

/** Order created from the basket, shared between the two views for this session. */
let pendingOrder: CreatedOrder | null = null;
const listeners = new Set<() => void>();

const useCreatedOrder = () => {
  const [pending, setLocal] = useState<CreatedOrder | null>(pendingOrder);
  useEffect(() => {
    const sync = () => setLocal(pendingOrder);
    listeners.add(sync);
    return () => {
      listeners.delete(sync);
    };
  }, []);
  const setPending = (order: CreatedOrder | null) => {
    pendingOrder = order;
    listeners.forEach((l) => l());
  };
  return { pending, setPending };
};
