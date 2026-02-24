'use client';

import React, { FC } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Package, Clock, CheckCircle2, XCircle, Truck, Loader2 } from 'lucide-react';
import { OrderWithItems, OrderStatus } from '@/app/lib/order';
// ── Status display config ──────────────────────────────────────────────────
const statusConfig: Record<OrderStatus, { label: string; color: string; icon: React.ReactNode }> = {
  pending_messenger_confirmation: {
    label: 'Awaiting Messenger Confirmation',
    color: 'bg-amber-100 text-amber-700 border-amber-200',
    icon: <Clock className="w-4 h-4" />,
  },
  confirmed: {
    label: 'Order Confirmed',
    color: 'bg-blue-100 text-blue-700 border-blue-200',
    icon: <CheckCircle2 className="w-4 h-4" />,
  },
  in_progress: {
    label: 'Being Prepared',
    color: 'bg-purple-100 text-purple-700 border-purple-200',
    icon: <Loader2 className="w-4 h-4 animate-spin" />,
  },
  completed: {
    label: 'Completed',
    color: 'bg-green-100 text-green-700 border-green-200',
    icon: <CheckCircle2 className="w-4 h-4" />,
  },
  cancelled: {
    label: 'Cancelled',
    color: 'bg-red-100 text-red-700 border-red-200',
    icon: <XCircle className="w-4 h-4" />,
  },
};

interface Props {
  order: OrderWithItems;
}

export const OrderDetailsClient: FC<Props> = ({ order }) => {
  const router = useRouter();
  const status = statusConfig[order.status] ?? statusConfig.pending_messenger_confirmation;

  const createdAt = new Date(order.created_at).toLocaleDateString('en-PH', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
  console.log(order.order_items[0]?.product_image_url, 'product_image_url');

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#faf7e5] via-[#f5e4c0] to-[#f0d9b5] px-4 py-10">

      {/* Ambient blobs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-20 left-10 w-56 h-56 bg-purple-300 rounded-full opacity-20 blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-64 h-64 bg-pink-200 rounded-full opacity-15 blur-3xl animate-pulse" />
      </div>

      <div className="relative z-10 max-w-2xl mx-auto space-y-6">

        {/* Back */}
        <button
          onClick={() => router.push('/store')}
          className="inline-flex items-center gap-2 text-purple-700 hover:text-purple-900 font-bold transition-all group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:scale-110 transition-transform" />
          Back to Store
        </button>

        {/* Header card */}
        <div className="bg-white rounded-3xl border-2 border-purple-100 shadow-xl p-6 space-y-4">
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-purple-400 mb-1">
                Order Reference
              </p>
              <p className="text-3xl font-black tracking-widest bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">
                {order.ref}
              </p>
              <p className="text-xs text-gray-400 mt-1">{createdAt}</p>
            </div>

            {/* Status badge */}
            <div className={`inline-flex items-center gap-2 px-3 py-2 rounded-full border font-semibold text-sm ${status.color}`}>
              {status.icon}
              {status.label}
            </div>
          </div>

          {/* Note */}
          {order.customer_note && (
            <div className="px-4 py-3 bg-amber-50 border border-amber-100 rounded-xl">
              <p className="text-xs font-bold uppercase tracking-widest text-amber-500 mb-1">Note</p>
              <p className="text-sm text-gray-700">{order.customer_note}</p>
            </div>
          )}
        </div>

        {/* Order items */}
        <div className="bg-white rounded-3xl border-2 border-purple-100 shadow-xl overflow-hidden">
          <div className="px-6 py-4 border-b border-purple-100 bg-gradient-to-r from-purple-50 to-pink-50 flex items-center gap-2">
            <Package className="w-4 h-4 text-purple-500" />
            <h2 className="font-bold text-gray-900">Items Ordered</h2>
            <span className="ml-auto text-sm text-gray-500">
              {order.order_items.length} item{order.order_items.length !== 1 ? 's' : ''}
            </span>
          </div>

          <div className="divide-y divide-purple-50">
            {order.order_items.map((item) => (
              <div key={item.id} className="flex gap-4 px-6 py-4">
                {/* Image */}
                <img
                  src={item.product_image_url}
                  alt={item.product_name}
                  className="w-16 h-16 rounded-xl object-cover flex-shrink-0 shadow-sm"
                />

                {/* Details */}
                <div className="flex-1 min-w-0 space-y-1">
                  <p className="font-bold text-gray-900 line-clamp-2 text-sm">{item.product_name}</p>
                  {item.note && (
                    <p className="text-xs text-purple-600 bg-purple-50 px-2 py-0.5 rounded-full inline-block">
                      {item.note}
                    </p>
                  )}
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-gray-400">
                      ₱{item.unit_price.toFixed(2)} × {item.quantity}
                    </p>
                    <p className="text-sm font-black text-amber-600">
                      ₱{(item.unit_price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Total */}
          <div className="px-6 py-4 border-t-2 border-purple-100 bg-gradient-to-r from-amber-50 to-orange-50 flex items-center justify-between">
            <span className="font-bold text-gray-700">Total</span>
            <span className="text-2xl font-black bg-gradient-to-r from-amber-600 to-orange-500 bg-clip-text text-transparent">
              ₱{Number(order.total_price).toFixed(2)}
            </span>
          </div>
        </div>

        {/* Info box */}
        <div className="flex items-start gap-3 p-4 bg-white/60 backdrop-blur-sm rounded-2xl border border-amber-100">
          <Truck className="w-5 h-5 text-purple-500 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-gray-600 font-medium">
            Your order will be confirmed once our team receives your Messenger message with this Order Ref.{' '}
            <strong className="text-gray-800">Estimated delivery: 2–5 business days</strong> depending on location.
          </p>
        </div>
      </div>
    </div>
  );
};