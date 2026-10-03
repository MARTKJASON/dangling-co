'use client';

import React, { FC, useEffect, useState } from 'react';
import {
  Clock, CheckCircle2, XCircle, Loader2, PackageOpen,
  RefreshCw, ChevronDown, ExternalLink, Search, Hammer, Info,
} from 'lucide-react';
import { Order, OrderStatus, useOrders } from '@/app/hooks/useOrders';
import { formatPeso } from '@/app/lib/format';

const PILL_BASE = 'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[13px] font-semibold whitespace-nowrap';

const STATUS_CONFIG: Record<OrderStatus, {
  label: string; short: string; bg: string; text: string;
  border: string; dot: string; icon: React.ReactNode;
}> = {
  pending_messenger_confirmation: {
    label: 'Pending', short: 'Pending',
    bg: 'bg-butter-100', text: 'text-butter-800', border: '', dot: 'bg-butter-400',
    icon: <Clock className="w-3.5 h-3.5" aria-hidden="true" />,
  },
  confirmed: {
    label: 'Confirmed', short: 'Confirmed',
    bg: 'bg-peri-50', text: 'text-peri-800', border: '', dot: 'bg-peri-300',
    icon: <CheckCircle2 className="w-3.5 h-3.5" aria-hidden="true" />,
  },
  in_progress: {
    label: 'Being made', short: 'Being made',
    bg: 'bg-peri-600', text: 'text-white', border: '', dot: 'bg-peri-600',
    icon: <Hammer className="w-3.5 h-3.5" aria-hidden="true" />,
  },
  completed: {
    label: 'Completed', short: 'Completed',
    bg: 'bg-sage-100', text: 'text-sage-800', border: '', dot: 'bg-sage-400',
    icon: <CheckCircle2 className="w-3.5 h-3.5" aria-hidden="true" />,
  },
  cancelled: {
    label: 'Cancelled', short: 'Cancelled',
    bg: 'bg-cream-200', text: 'text-ink-600', border: '', dot: 'bg-cream-300',
    icon: <XCircle className="w-3.5 h-3.5" aria-hidden="true" />,
  },
};

const STATUS_TRANSITIONS: Record<OrderStatus, OrderStatus[]> = {
  pending_messenger_confirmation: ['confirmed', 'cancelled'],
  confirmed: ['in_progress', 'cancelled'],
  in_progress: ['completed', 'cancelled'],
  completed: [],
  cancelled: [],
};

const TRANSITION_CONFIG: Record<OrderStatus, { label: string; className: string }> = {
  confirmed:   { label: 'Confirm order',   className: 'btn btn-primary btn-sm' },
  in_progress: { label: 'Start making',    className: 'btn btn-primary btn-sm' },
  completed:   { label: 'Mark completed',  className: 'btn btn-primary btn-sm' },
  cancelled:   { label: 'Cancel Order',    className: 'btn btn-danger btn-sm' },
  pending_messenger_confirmation: { label: 'Reset to Pending', className: 'btn btn-ghost btn-sm' },
};

const STATUS_HINTS: Record<OrderStatus, string> = {
  pending_messenger_confirmation:
    'Waiting for the customer’s Messenger message with this order ref. Confirm once you’ve agreed on details and shipping.',
  confirmed: 'Confirmed with the customer. Mark it as being made when you start beading.',
  in_progress: 'Being made. Mark it completed once it has been shipped or picked up.',
  completed: 'All done. This order is complete.',
  cancelled: 'This order was cancelled. No further action needed.',
};

const ALL_STATUSES: (OrderStatus | 'all')[] = [
  'all',
  'pending_messenger_confirmation',
  'confirmed',
  'in_progress',
  'completed',
  'cancelled',
];

const FILTER_LABELS: Record<string, string> = {
  all: 'All',
  pending_messenger_confirmation: 'Pending',
  confirmed: 'Confirmed',
  in_progress: 'Being made',
  completed: 'Completed',
  cancelled: 'Cancelled',
};

const GRID_COLS = 'md:grid-cols-[44px_minmax(150px,1.2fr)_minmax(140px,1fr)_110px_140px_minmax(170px,auto)]';

const StatusPill: FC<{ status: OrderStatus }> = ({ status }) => {
  const cfg = STATUS_CONFIG[status];
  return (
    <span className={`${PILL_BASE} ${cfg.bg} ${cfg.text}`}>
      {cfg.icon}
      {cfg.label}
    </span>
  );
};

const ItemThumbs: FC<{ order: Order }> = ({ order }) => {
  const shown = order.order_items.slice(0, 3);
  const extra = order.order_items.length - shown.length;
  return (
    <div className="flex items-center gap-1.5">
      {shown.map(item => (
        <img
          key={item.id}
          src={item.product_image_url}
          alt={item.product_name}
          title={item.product_name}
          className="w-9 h-9 rounded-lg object-cover bg-cream-200 flex-shrink-0"
        />
      ))}
      {extra > 0 && (
        <span className="inline-flex items-center justify-center w-9 h-9 rounded-lg bg-cream-200 text-ink-600 text-xs font-semibold">
          +{extra}
        </span>
      )}
    </div>
  );
};

// ── Order Row ───────────────────────────────────────────────────────────────
const OrderCard: FC<{
  order: Order;
  onStatusChange: (id: string, status: OrderStatus) => Promise<void>;
}> = ({ order, onStatusChange }) => {
  const [expanded, setExpanded] = useState(false);
  const [updating, setUpdating] = useState<OrderStatus | null>(null);
  const [confirmCancel, setConfirmCancel] = useState(false);

  const transitions = STATUS_TRANSITIONS[order.status];
  const primaryNext = transitions.find(t => t !== 'cancelled');
  const canCancel = transitions.includes('cancelled');
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? '';
  const detailsId = `order-details-${order.id}`;
  const itemCount = order.order_items.reduce((n, i) => n + i.quantity, 0);

  const createdAt = new Date(order.created_at).toLocaleDateString('en-PH', {
    month: 'short', day: 'numeric', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });

  const handleTransition = async (newStatus: OrderStatus) => {
    if (newStatus === 'cancelled' && !confirmCancel) {
      setConfirmCancel(true);
      return;
    }
    setConfirmCancel(false);
    setUpdating(newStatus);
    try {
      await onStatusChange(order.id, newStatus);
    } finally {
      setUpdating(null);
    }
  };

  const primaryButton = primaryNext ? (
    <button
      type="button"
      onClick={(e) => { e.stopPropagation(); handleTransition(primaryNext); }}
      disabled={!!updating}
      className={TRANSITION_CONFIG[primaryNext].className}
    >
      {updating === primaryNext && <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />}
      {TRANSITION_CONFIG[primaryNext].label}
    </button>
  ) : null;

  const toggle = () => setExpanded(e => !e);

  const chevron = (
    <button
      type="button"
      onClick={(e) => { e.stopPropagation(); toggle(); }}
      aria-expanded={expanded}
      aria-controls={detailsId}
      aria-label={`${expanded ? 'Hide' : 'Show'} details for order ${order.ref}`}
      className="icon-btn text-ink-600"
    >
      <ChevronDown
        className={`w-5 h-5 transition-transform duration-200 ${expanded ? 'rotate-180' : ''}`}
        aria-hidden="true"
      />
    </button>
  );

  return (
    <li className={`border-b border-cream-200 last:border-b-0 ${expanded ? 'bg-cream-50' : ''}`}>
      {/* Desktop row */}
      <div
        className={`hidden md:grid ${GRID_COLS} items-center gap-4 px-3 pr-5 py-3 cursor-pointer hover:bg-cream-50 transition-colors`}
        onClick={toggle}
      >
        {chevron}
        <div className="min-w-0">
          <p className="font-bold text-ink-900 tracking-wide">{order.ref}</p>
          <p className="text-[13px] text-ink-600">{createdAt}</p>
        </div>
        <ItemThumbs order={order} />
        <p className="font-bold text-ink-900 tabular-nums">{formatPeso(order.total_price)}</p>
        <div><StatusPill status={order.status} /></div>
        <div className="flex justify-end">{primaryButton}</div>
      </div>

      {/* Mobile row */}
      <div className="md:hidden px-4 py-4 space-y-3 cursor-pointer" onClick={toggle}>
        <div className="flex items-start gap-2">
          <div className="flex-1 min-w-0">
            <p className="font-bold text-ink-900 tracking-wide">{order.ref}</p>
            <p className="text-[13px] text-ink-600">{createdAt}</p>
          </div>
          <StatusPill status={order.status} />
          <div className="-mr-2 -mt-2">{chevron}</div>
        </div>
        <div className="flex items-center justify-between gap-3">
          <ItemThumbs order={order} />
          <p className="font-bold text-ink-900 tabular-nums">{formatPeso(order.total_price)}</p>
        </div>
        {primaryButton && <div className="flex [&>button]:w-full">{primaryButton}</div>}
      </div>

      {/* Expanded content */}
      {expanded && (
        <div id={detailsId} className="px-4 md:pl-[68px] md:pr-5 pb-5 space-y-4 animate-fade-in">
          <p className="eyebrow">
            {itemCount} item{itemCount !== 1 ? 's' : ''}
          </p>

          <ul className="bg-white rounded-field border border-cream-300 divide-y divide-cream-200">
            {order.order_items.map(item => (
              <li key={item.id} className="flex items-center gap-3 px-4 py-3">
                <img
                  src={item.product_image_url}
                  alt=""
                  className="w-12 h-12 rounded-lg object-cover flex-shrink-0 bg-cream-200"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-[15px] font-semibold text-ink-900 line-clamp-1">
                    {item.product_name} <span className="text-ink-600 font-normal">×{item.quantity}</span>
                  </p>
                  {item.note && <p className="text-sm text-ink-600 line-clamp-2">{item.note}</p>}
                  <p className="text-[13px] text-ink-600 tabular-nums">{formatPeso(item.unit_price)} each</p>
                </div>
                <p className="text-[15px] font-bold text-ink-900 tabular-nums flex-shrink-0">
                  {formatPeso(item.unit_price * item.quantity)}
                </p>
              </li>
            ))}
          </ul>

          {order.customer_note && (
            <div className="px-4 py-3 bg-butter-100 rounded-field">
              <p className="text-xs font-semibold uppercase tracking-[0.08em] text-butter-800 mb-1">Customer note</p>
              <p className="text-sm text-ink-900">{order.customer_note}</p>
            </div>
          )}

          <div className="flex items-start gap-2.5 px-4 py-3 bg-peri-50 rounded-field text-peri-800">
            <Info className="w-4 h-4 flex-shrink-0 mt-0.5" aria-hidden="true" />
            <p className="text-sm">{STATUS_HINTS[order.status]}</p>
          </div>

          {/* Footer: order page link + secondary actions */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-2">
            <a
              href={`${appUrl}/order/${order.ref}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-ghost btn-sm self-start"
              onClick={e => e.stopPropagation()}
            >
              <ExternalLink className="w-4 h-4" aria-hidden="true" />
              View order page
            </a>

            <div className="flex-1" />

            {confirmCancel && (
              <div className="flex flex-wrap items-center gap-2 animate-fade-in" role="alert">
                <span className="text-sm font-semibold text-cherry-700">Cancel this order?</span>
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); handleTransition('cancelled'); }}
                  disabled={!!updating}
                  className="btn btn-sm bg-cherry-600 text-white hover:bg-cherry-700"
                >
                  {updating === 'cancelled' && <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />}
                  Yes, cancel
                </button>
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); setConfirmCancel(false); }}
                  className="btn btn-ghost btn-sm"
                >
                  Keep order
                </button>
              </div>
            )}

            {!confirmCancel && canCancel && (
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); handleTransition('cancelled'); }}
                disabled={!!updating}
                className={TRANSITION_CONFIG.cancelled.className}
              >
                <XCircle className="w-4 h-4" aria-hidden="true" />
                {TRANSITION_CONFIG.cancelled.label}
              </button>
            )}
          </div>
        </div>
      )}
    </li>
  );
};

// ── Main OrdersTab ──────────────────────────────────────────────────────────
export const OrdersTab: FC = () => {
  const { orders, loading, error, loadOrders, updateOrderStatus } = useOrders();
  const [filterStatus, setFilterStatus] = useState<OrderStatus | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => { loadOrders(); }, [loadOrders]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadOrders();
    setRefreshing(false);
  };

  // Filter + search
  const filtered = orders.filter(order => {
    const matchesStatus = filterStatus === 'all' || order.status === filterStatus;
    const q = searchQuery.toLowerCase();
    const matchesSearch = !q
      || order.ref.toLowerCase().includes(q)
      || order.order_items.some(i => i.product_name.toLowerCase().includes(q));
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="space-y-5">

      {/* Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center gap-3">
        {/* Status segmented control */}
        <div className="overflow-x-auto no-scrollbar -mx-4 px-4 md:mx-0 md:px-0">
          <div className="inline-flex gap-1 p-1 bg-cream-200 rounded-full" role="group" aria-label="Filter orders by status">
            {ALL_STATUSES.map(s => {
              const count = s === 'all' ? orders.length : orders.filter(o => o.status === s).length;
              const isActive = filterStatus === s;
              const highlight = s === 'pending_messenger_confirmation' && count > 0;
              return (
                <button
                  key={s}
                  type="button"
                  onClick={() => setFilterStatus(s)}
                  aria-pressed={isActive}
                  className={`inline-flex items-center gap-2 min-h-[40px] px-4 rounded-full text-sm font-semibold whitespace-nowrap transition-colors ${
                    isActive ? 'bg-white text-ink-900 shadow-rest' : 'text-ink-600 hover:text-ink-900'
                  }`}
                >
                  {FILTER_LABELS[s]}
                  <span className={`min-w-[22px] px-1.5 py-0.5 rounded-full text-xs font-bold tabular-nums ${
                    highlight ? 'bg-butter-400 text-ink-900' : 'bg-cream-200 text-ink-600'
                  }`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex items-center gap-2 lg:ml-auto lg:w-[340px]">
          {/* Search */}
          <div className="relative flex-1">
            <label htmlFor="order-search" className="sr-only">Search orders</label>
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-ink-500 pointer-events-none" aria-hidden="true" />
            <input
              id="order-search"
              type="search"
              placeholder="Order ref or product…"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="field pl-11 rounded-full"
            />
          </div>

          <button
            type="button"
            onClick={handleRefresh}
            disabled={refreshing || loading}
            aria-label="Refresh orders"
            title="Refresh orders"
            className="icon-btn border border-cream-300 bg-white text-ink-900"
          >
            <RefreshCw className={`w-5 h-5 ${refreshing ? 'animate-spin' : ''}`} aria-hidden="true" />
          </button>
        </div>
      </div>

      {/* Loading */}
      {loading && !refreshing && (
        <div className="flex flex-col items-center justify-center py-16 gap-3 bg-white rounded-card border border-cream-300" role="status">
          <Loader2 className="w-8 h-8 animate-spin text-peri-600" aria-hidden="true" />
          <p className="text-sm text-ink-600">Loading orders…</p>
        </div>
      )}

      {/* Error */}
      {error && (
        <div role="alert" className="flex items-start gap-3 p-4 bg-cherry-100 text-cherry-700 rounded-card">
          <XCircle className="w-5 h-5 flex-shrink-0 mt-0.5" aria-hidden="true" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold">Couldn&apos;t load orders</p>
            <p className="text-sm">{error}</p>
          </div>
          <button type="button" onClick={handleRefresh} className="btn btn-danger btn-sm">
            Retry
          </button>
        </div>
      )}

      {/* Empty state */}
      {!loading && !error && filtered.length === 0 && (
        <div className="flex flex-col items-center justify-center text-center py-14 px-6 bg-white rounded-card border border-cream-300">
          <div className="w-14 h-14 rounded-full bg-cream-200 flex items-center justify-center mb-4">
            <PackageOpen className="w-7 h-7 text-ink-600" aria-hidden="true" />
          </div>
          <p className="font-display text-xl font-semibold text-ink-900">
            {searchQuery ? 'No orders match your search' : 'No orders here yet'}
          </p>
          <p className="text-sm text-ink-600 mt-1 max-w-xs">
            {searchQuery ? 'Try a different order ref or product name.' : 'Orders will appear here once customers submit them.'}
          </p>
        </div>
      )}

      {/* Orders list */}
      {!loading && filtered.length > 0 && (
        <div className="bg-white rounded-card border border-cream-300 overflow-hidden">
          <div className="overflow-x-auto">
            <div className="md:min-w-[820px]">
              {/* Column headings (desktop) */}
              <div className={`hidden md:grid ${GRID_COLS} gap-4 px-3 pr-5 py-3 border-b border-cream-300 bg-cream-50`}>
                <span aria-hidden="true" />
                <span className="eyebrow">Order</span>
                <span className="eyebrow">Items</span>
                <span className="eyebrow">Total</span>
                <span className="eyebrow">Status</span>
                <span className="eyebrow text-right">Next step</span>
              </div>
              <ul>
                {filtered.map(order => (
                  <OrderCard
                    key={order.id}
                    order={order}
                    onStatusChange={updateOrderStatus}
                  />
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Total count footer */}
      {!loading && filtered.length > 0 && (
        <p className="text-sm text-center text-ink-600">
          Showing {filtered.length} of {orders.length} order{orders.length !== 1 ? 's' : ''}
        </p>
      )}
    </div>
  );
};
