'use client';

import React, { FC } from 'react';
import Link from 'next/link';
import {
  ArrowLeft, Clock, CheckCircle2, XCircle, Truck, Hammer, Info, MessageCircle, ExternalLink,
} from 'lucide-react';
import { OrderWithItems, OrderStatus } from '@/app/lib/order';
import { formatPeso } from '@/app/lib/format';
import { Logo } from '@/app/components/brand/Logo';

const FACEBOOK_PAGE_URL = 'https://m.me/696684716864112';

// ── Status display config (same pill styles as the merchant dashboard) ─────
const statusConfig: Record<OrderStatus, { label: string; color: string; icon: React.ReactNode }> = {
  pending_messenger_confirmation: {
    label: 'Awaiting confirmation',
    color: 'bg-butter-100 text-butter-800',
    icon: <Clock className="w-3.5 h-3.5" aria-hidden="true" />,
  },
  confirmed: {
    label: 'Confirmed',
    color: 'bg-peri-50 text-peri-800',
    icon: <CheckCircle2 className="w-3.5 h-3.5" aria-hidden="true" />,
  },
  in_progress: {
    label: 'Being made',
    color: 'bg-peri-600 text-white',
    icon: <Hammer className="w-3.5 h-3.5" aria-hidden="true" />,
  },
  completed: {
    label: 'Completed',
    color: 'bg-sage-100 text-sage-800',
    icon: <CheckCircle2 className="w-3.5 h-3.5" aria-hidden="true" />,
  },
  cancelled: {
    label: 'Cancelled',
    color: 'bg-cream-200 text-ink-600',
    icon: <XCircle className="w-3.5 h-3.5" aria-hidden="true" />,
  },
};

interface Props {
  order: OrderWithItems;
}

export const OrderDetailsClient: FC<Props> = ({ order }) => {
  const status = statusConfig[order.status] ?? statusConfig.pending_messenger_confirmation;
  const itemCount = order.order_items.reduce((n, i) => n + i.quantity, 0);

  const createdAt = new Date(order.created_at).toLocaleDateString('en-PH', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div className="min-h-screen bg-cream-100 px-4 py-8 sm:py-12">
      <div className="max-w-xl mx-auto space-y-5 animate-fade-up">

        {/* Top bar */}
        <div className="flex items-center justify-between gap-3">
          <Link href="/shop" className="btn btn-ghost btn-sm -ml-3">
            <ArrowLeft className="w-4 h-4" aria-hidden="true" />
            Back to shop
          </Link>
          <Logo size="sm" />
        </div>

        {/* Order card */}
        <div className="bg-white rounded-card border border-cream-300 shadow-rest overflow-hidden">
          {/* Header */}
          <div className="p-5 sm:p-6 space-y-3">
            <div className="flex items-center justify-between gap-3 flex-wrap">
              <span className="inline-flex items-center px-3 py-1 rounded-full bg-peri-50 text-peri-800 text-sm font-semibold tracking-wide">
                {order.ref}
              </span>
              <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[13px] font-semibold ${status.color}`}>
                {status.icon}
                {status.label}
              </span>
            </div>
            <h1 className="font-display text-3xl font-semibold text-ink-900">Your order</h1>
            <p className="text-sm text-ink-600">Placed {createdAt}</p>

            {order.customer_note && (
              <div className="px-4 py-3 bg-cream-50 border border-cream-200 rounded-field">
                <p className="eyebrow mb-1">Your note</p>
                <p className="text-[15px] text-ink-900">{order.customer_note}</p>
              </div>
            )}
          </div>

          {/* Items */}
          <div className="border-t border-cream-200">
            <div className="flex items-center justify-between px-5 sm:px-6 pt-4 pb-2">
              <h2 className="eyebrow">Items</h2>
              <span className="text-sm text-ink-600">
                {itemCount} item{itemCount !== 1 ? 's' : ''}
              </span>
            </div>

            <ul className="divide-y divide-cream-200">
              {order.order_items.map((item) => (
                <li key={item.id} className="flex gap-4 px-5 sm:px-6 py-4">
                  <img
                    src={item.product_image_url}
                    alt=""
                    className="w-16 h-16 rounded-field object-cover flex-shrink-0 bg-cream-200"
                  />
                  <div className="flex-1 min-w-0 space-y-0.5">
                    <p className="font-display text-[17px] font-semibold text-ink-900 line-clamp-2">
                      {item.product_name}
                    </p>
                    {item.note && <p className="text-sm text-ink-600">{item.note}</p>}
                    <p className="text-sm text-ink-600 tabular-nums">
                      {formatPeso(item.unit_price)} × {item.quantity}
                    </p>
                  </div>
                  <p className="text-[15px] font-bold text-ink-900 tabular-nums flex-shrink-0">
                    {formatPeso(item.unit_price * item.quantity)}
                  </p>
                </li>
              ))}
            </ul>
          </div>

          {/* Total */}
          <div className="px-5 sm:px-6 py-4 border-t border-cream-300 bg-cream-50 flex items-center justify-between">
            <span className="text-[15px] font-semibold text-ink-900">Total</span>
            <span className="text-2xl font-bold text-ink-900 tabular-nums">
              {formatPeso(order.total_price)}
            </span>
          </div>
        </div>

        {/* Shipping fee notice */}
        <div className="flex items-start gap-3 p-4 bg-butter-100 rounded-card">
          <Info className="w-5 h-5 text-butter-800 flex-shrink-0 mt-0.5" aria-hidden="true" />
          <p className="text-sm text-butter-800">
            Shipping fee is <strong className="font-bold">not included</strong> in the total. We&apos;ll confirm the
            shipping cost with you on Messenger.
          </p>
        </div>

        {/* Info box */}
        <div className="flex items-start gap-3 p-4 bg-white border border-cream-300 rounded-card">
          <Truck className="w-5 h-5 text-peri-600 flex-shrink-0 mt-0.5" aria-hidden="true" />
          <p className="text-sm text-ink-600">
            Your order is confirmed once we receive your Messenger message with this order ref.{' '}
            <strong className="font-semibold text-ink-900">Estimated delivery: 2–5 business days</strong>, depending on
            location.
          </p>
        </div>

        {order.status === 'pending_messenger_confirmation' && (
          <a
            href={FACEBOOK_PAGE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-messenger btn-lg w-full"
          >
            <MessageCircle className="w-5 h-5" aria-hidden="true" />
            Message us on Facebook
            <ExternalLink className="w-4 h-4 opacity-80" aria-hidden="true" />
            <span className="sr-only">(opens in a new tab)</span>
          </a>
        )}
      </div>
    </div>
  );
};
