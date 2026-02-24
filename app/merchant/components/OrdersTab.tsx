'use client';

import React, { FC, useEffect, useState } from 'react';
import {
  Clock, CheckCircle2, XCircle, Loader2, Package,
  RefreshCw, ChevronDown, ChevronUp, ExternalLink,
  ShoppingBag, Truck, Search,
} from 'lucide-react';
import { Order, OrderStatus, useOrders } from '@/app/hooks/useOrders';

const STATUS_CONFIG: Record<OrderStatus, {
  label: string; short: string; bg: string; text: string;
  border: string; dot: string; icon: React.ReactNode;
}> = {
  pending_messenger_confirmation: {
    label: 'Pending Confirmation', short: 'Pending',
    bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200', dot: 'bg-amber-400',
    icon: <Clock className="w-3.5 h-3.5" />,
  },
  confirmed: {
    label: 'Confirmed', short: 'Confirmed',
    bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200', dot: 'bg-blue-400',
    icon: <CheckCircle2 className="w-3.5 h-3.5" />,
  },
  in_progress: {
    label: 'In Progress', short: 'In Progress',
    bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200', dot: 'bg-purple-400',
    icon: <Truck className="w-3.5 h-3.5" />,
  },
  completed: {
    label: 'Completed', short: 'Completed',
    bg: 'bg-green-50', text: 'text-green-700', border: 'border-green-200', dot: 'bg-green-400',
    icon: <CheckCircle2 className="w-3.5 h-3.5" />,
  },
  cancelled: {
    label: 'Cancelled', short: 'Cancelled',
    bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200', dot: 'bg-red-400',
    icon: <XCircle className="w-3.5 h-3.5" />,
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
  confirmed:   { label: 'Confirm Order',      className: 'bg-blue-500 hover:bg-blue-600 text-white' },
  in_progress: { label: 'Mark In Progress',   className: 'bg-purple-500 hover:bg-purple-600 text-white' },
  completed:   { label: 'Mark Completed',     className: 'bg-green-500 hover:bg-green-600 text-white' },
  cancelled:   { label: 'Cancel Order',       className: 'bg-red-100 hover:bg-red-200 text-red-700' },
  pending_messenger_confirmation: { label: 'Reset to Pending', className: 'bg-amber-100 hover:bg-amber-200 text-amber-700' },
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
  all: 'All Orders',
  pending_messenger_confirmation: 'Pending',
  confirmed: 'Confirmed',
  in_progress: 'In Progress',
  completed: 'Completed',
  cancelled: 'Cancelled',
};

// ── Order Card ──────────────────────────────────────────────────────────────
const OrderCard: FC<{
  order: Order;
  onStatusChange: (id: string, status: OrderStatus) => Promise<void>;
}> = ({ order, onStatusChange }) => {
  const [expanded, setExpanded] = useState(false);
  const [updating, setUpdating] = useState<OrderStatus | null>(null);
  const [confirmCancel, setConfirmCancel] = useState(false);

  const status = STATUS_CONFIG[order.status];
  const transitions = STATUS_TRANSITIONS[order.status];
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? '';

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

  return (
    <div className={`bg-white rounded-2xl border-2 transition-all duration-300 shadow-sm hover:shadow-lg overflow-hidden ${
      order.status === 'pending_messenger_confirmation'
        ? 'border-amber-200 shadow-amber-100'
        : 'border-purple-100'
    }`}>

      {/* Header row */}
      <div
        className="flex items-center gap-3 px-4 sm:px-5 py-4 cursor-pointer select-none group"
        onClick={() => setExpanded(e => !e)}
      >
        {/* Pulse dot */}
        <div className="relative flex-shrink-0">
          <div className={`w-2.5 h-2.5 rounded-full ${status.dot}`} />
          {order.status === 'pending_messenger_confirmation' && (
            <div className="absolute inset-0 rounded-full bg-amber-400 animate-ping opacity-60" />
          )}
        </div>

        {/* Ref + timestamp */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-black text-gray-900 tracking-wider text-sm sm:text-base">
              {order.ref}
            </span>
            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full border text-xs font-semibold ${status.bg} ${status.text} ${status.border}`}>
              {status.icon}
              <span className="hidden sm:inline">{status.label}</span>
              <span className="sm:hidden">{status.short}</span>
            </span>
          </div>
          <p className="text-xs text-gray-400 mt-0.5">{createdAt}</p>
        </div>

        {/* Total */}
        <div className="text-right flex-shrink-0">
          <p className="text-xs text-gray-400">{order.order_items.length} item{order.order_items.length !== 1 ? 's' : ''}</p>
          <p className="font-black text-sm bg-gradient-to-r from-amber-600 to-orange-500 bg-clip-text text-transparent">
            ₱{Number(order.total_price).toFixed(2)}
          </p>
        </div>

        <div className="flex-shrink-0 text-gray-400 group-hover:text-purple-500 transition-colors">
          {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </div>
      </div>

      {/* Expanded content */}
      {expanded && (
        <div className="border-t border-purple-100 animate-in fade-in slide-in-from-top-1 duration-200">

          {/* Items */}
          <div className="divide-y divide-purple-50">
            {order.order_items.map(item => (
              <div key={item.id} className="flex items-center gap-3 px-4 sm:px-5 py-3">
                <img
                  src={item.product_image_url}
                  alt={item.product_name}
                  className="w-12 h-12 rounded-xl object-cover flex-shrink-0 shadow-sm border border-purple-100"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-gray-800 line-clamp-1">{item.product_name}</p>
                  {item.note && (
                    <span className="text-xs text-purple-600 bg-purple-50 border border-purple-100 px-2 py-0.5 rounded-full inline-block mt-0.5">
                      {item.note}
                    </span>
                  )}
                  <p className="text-xs text-gray-400 mt-0.5">₱{item.unit_price.toFixed(2)} × {item.quantity}</p>
                </div>
                <p className="text-sm font-black text-gray-700 flex-shrink-0">
                  ₱{(item.unit_price * item.quantity).toFixed(2)}
                </p>
              </div>
            ))}
          </div>

          {/* Customer note */}
          {order.customer_note && (
            <div className="mx-4 sm:mx-5 my-3 px-4 py-3 bg-amber-50 border border-amber-100 rounded-xl">
              <p className="text-xs font-bold uppercase tracking-widest text-amber-500 mb-1">Customer Note</p>
              <p className="text-sm text-gray-700">{order.customer_note}</p>
            </div>
          )}

          {/* Footer: order page link + action buttons */}
          <div className="px-4 sm:px-5 py-4 border-t border-purple-50 bg-gradient-to-r from-purple-50/50 to-pink-50/50 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">

            {/* View order page */}
            <a
              href={`${appUrl}/order/${order.ref}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-purple-600 hover:text-purple-800 transition-colors"
              onClick={e => e.stopPropagation()}
            >
              <ExternalLink className="w-3.5 h-3.5" />
              View Order Page
            </a>

            <div className="flex-1" />

            {/* Cancel confirm prompt */}
            {confirmCancel && (
              <div className="flex items-center gap-2 text-xs text-red-600 font-semibold animate-in fade-in">
                <span>Are you sure?</span>
                <button
                  onClick={(e) => { e.stopPropagation(); handleTransition('cancelled'); }}
                  className="px-3 py-1.5 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-all"
                >
                  Yes, cancel
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); setConfirmCancel(false); }}
                  className="px-3 py-1.5 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg transition-all"
                >
                  No
                </button>
              </div>
            )}

            {/* Transition buttons */}
            {!confirmCancel && transitions.length > 0 && (
              <div className="flex gap-2 flex-wrap justify-end">
                {transitions.map(nextStatus => {
                  const cfg = TRANSITION_CONFIG[nextStatus];
                  const isUpdating = updating === nextStatus;
                  return (
                    <button
                      key={nextStatus}
                      onClick={(e) => { e.stopPropagation(); handleTransition(nextStatus); }}
                      disabled={!!updating}
                      className={`inline-flex items-center gap-1.5 px-3 py-2 text-xs font-bold rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 ${cfg.className}`}
                    >
                      {isUpdating ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      ) : null}
                      {cfg.label}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
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

  // Derived counts
  const pendingCount = orders.filter(o => o.status === 'pending_messenger_confirmation').length;

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

      {/* Header row */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
        <div className="flex-1">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-purple-500" />
            Orders
            {pendingCount > 0 && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-amber-100 text-amber-700 border border-amber-200 text-xs font-black rounded-full animate-pulse">
                <Clock className="w-3 h-3" />
                {pendingCount} pending
              </span>
            )}
          </h2>
          <p className="text-sm text-gray-500 mt-0.5">Manage and update customer orders</p>
        </div>

        <button
          onClick={handleRefresh}
          disabled={refreshing || loading}
          className="self-start sm:self-auto inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-purple-600 bg-purple-50 hover:bg-purple-100 border border-purple-200 rounded-xl transition-all disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
        <input
          type="text"
          placeholder="Search by order ref or product name..."
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          className="w-full pl-11 pr-4 py-2.5 bg-white border-2 border-purple-200 rounded-xl focus:outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-100 text-sm placeholder-gray-400 transition-all shadow-sm"
        />
      </div>

      {/* Status filter tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
        {ALL_STATUSES.map(s => {
          const count = s === 'all' ? orders.length : orders.filter(o => o.status === s).length;
          const isActive = filterStatus === s;
          const cfg = s !== 'all' ? STATUS_CONFIG[s] : null;
          return (
            <button
              key={s}
              onClick={() => setFilterStatus(s)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold whitespace-nowrap border-2 transition-all flex-shrink-0 ${
                isActive
                  ? s === 'all'
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white border-transparent shadow-lg scale-105'
                    : `${cfg!.bg} ${cfg!.text} ${cfg!.border} scale-105 shadow-md`
                  : 'bg-white text-gray-500 border-gray-200 hover:border-purple-300 hover:text-purple-600'
              }`}
            >
              {s !== 'all' && cfg?.icon}
              {FILTER_LABELS[s]}
              <span className={`px-1.5 py-0.5 rounded-full text-xs font-black ${
                isActive
                  ? s === 'all' ? 'bg-white/20 text-white' : 'bg-white/60'
                  : 'bg-gray-100 text-gray-400'
              }`}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Loading */}
      {loading && !refreshing && (
        <div className="flex flex-col items-center justify-center py-16 gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-purple-400" />
          <p className="text-sm text-gray-500">Loading orders...</p>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="flex items-start gap-3 px-4 py-4 bg-red-50 border border-red-200 rounded-2xl">
          <XCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-bold text-red-700">Failed to load orders</p>
            <p className="text-xs text-red-500 mt-0.5">{error}</p>
          </div>
          <button onClick={handleRefresh} className="ml-auto text-xs font-semibold text-red-600 hover:text-red-800 underline">
            Retry
          </button>
        </div>
      )}

      {/* Empty state */}
      {!loading && !error && filtered.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 bg-white rounded-2xl border-2 border-purple-100 gap-4">
          <div className="p-4 bg-purple-50 rounded-full">
            <Package className="w-8 h-8 text-purple-400" />
          </div>
          <div className="text-center">
            <p className="font-semibold text-gray-700">
              {searchQuery ? 'No orders match your search' : 'No orders yet'}
            </p>
            <p className="text-sm text-gray-400 mt-1">
              {searchQuery ? 'Try a different search term' : 'Orders will appear here once customers submit them'}
            </p>
          </div>
        </div>
      )}

      {/* Orders list */}
      {!loading && filtered.length > 0 && (
        <div className="space-y-3">
          {filtered.map(order => (
            <OrderCard
              key={order.id}
              order={order}
              onStatusChange={updateOrderStatus}
            />
          ))}
        </div>
      )}

      {/* Total count footer */}
      {!loading && filtered.length > 0 && (
        <p className="text-xs text-center text-gray-400">
          Showing {filtered.length} of {orders.length} order{orders.length !== 1 ? 's' : ''}
        </p>
      )}
    </div>
  );
};