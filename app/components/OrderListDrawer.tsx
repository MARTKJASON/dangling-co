'use client';

import React, { FC, useState } from 'react';
import { useRouter } from 'next/navigation';
import { X, Trash2, Plus, Minus, ShoppingBag, Loader2, MessageCircle } from 'lucide-react';
import { useOrderStore } from '../store/useOrderStore';
import { createOrder } from '../lib/createOrder';

interface OrderListDrawerProps {
  open: boolean;
  onClose: () => void;
}

export const OrderListDrawer: FC<OrderListDrawerProps> = ({ open, onClose }) => {
  const router = useRouter();
  const { items, removeItem, updateQuantity, updateNote, clearOrder, totalPrice, totalItems } =
    useOrderStore();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (items.length === 0) return;
    setSubmitting(true);
    setError(null);

    try {
      const { ref } = await createOrder(items);
      clearOrder();
      onClose();
      router.push(`/order-confirm/${ref}`);
    } catch (err: any) {
      setError(err.message ?? 'Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (!open) return null;

 
  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-white z-50 shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-purple-100 bg-gradient-to-r from-purple-50 to-pink-50">
          <div className="flex items-center gap-3">
            <ShoppingBag className="w-5 h-5 text-purple-600" />
            <h2 className="text-lg font-bold text-gray-900">Order List</h2>
            {totalItems() > 0 && (
              <span className="px-2 py-0.5 bg-purple-500 text-white text-xs font-bold rounded-full">
                {totalItems()}
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-gray-400 hover:text-gray-600 hover:bg-white transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-4 text-center">
              <div className="text-5xl">🧺</div>
              <p className="text-gray-500 font-medium">Your order list is empty.</p>
              <p className="text-sm text-gray-400">Add items from the store to get started.</p>
            </div>
          ) : (
            items.map((item) => (
              <div
                key={item.product.id}
                className="flex gap-3 p-3 bg-gray-50 rounded-2xl border border-purple-100"
              >
                {/* Image */}
                <img
                  src={item.product.image_url}
                  alt={item.product.name}
                  className="w-16 h-16 rounded-xl object-cover flex-shrink-0"
                />

                {/* Info */}
                <div className="flex-1 min-w-0 space-y-1.5">
                  <p className="text-sm font-bold text-gray-900 line-clamp-1">
                    {item.product.name}
                  </p>
                  <p className="text-xs font-semibold text-amber-600">
                    ₱{item.product.price} each
                  </p>

                  {/* Note input */}
                  <input
                    type="text"
                    value={item.note}
                    onChange={(e) => updateNote(item.product.id, e.target.value)}
                    placeholder="Color, size, customization…"
                    className="w-full text-xs px-2 py-1 border border-purple-200 rounded-lg text-black focus:outline-none focus:border-purple-400 bg-white placeholder-gray-300"
                  />

                  {/* Quantity + remove */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                        className="w-6 h-6 rounded-full bg-purple-100 hover:bg-purple-200 text-purple-700 flex items-center justify-center transition-all"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="w-7 text-center text-sm font-bold text-gray-800">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                        className="w-6 h-6 rounded-full bg-purple-100 hover:bg-purple-200 text-purple-700 flex items-center justify-center transition-all"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-sm font-black text-purple-700">
                        ₱{(parseFloat(item.product.price) * item.quantity).toFixed(2)}
                      </span>
                      <button
                        onClick={() => removeItem(item.product.id)}
                        className="p-1 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="px-4 py-4 border-t border-purple-100 space-y-3 bg-white">
            {/* Total */}
            <div className="flex items-center justify-between px-1">
              <span className="text-sm font-semibold text-gray-600">Initial Total Price</span>
              <span className="text-xl font-black bg-gradient-to-r from-amber-600 to-orange-500 bg-clip-text text-transparent">
                ₱{totalPrice().toFixed(2)}
              </span>
            </div>

            {/* Error */}
            {error && (
              <p className="text-xs text-red-600 bg-red-50 border border-red-200 rounded-xl px-3 py-2">
                {error}
              </p>
            )}

            {/* Submit */}
            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="w-full flex items-center justify-center gap-2 px-6 py-3.5 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold rounded-2xl shadow-lg transition-all disabled:opacity-60 disabled:cursor-not-allowed hover:scale-[1.02] active:scale-100"
            >
              {submitting ? (
                <><Loader2 className="w-5 h-5 animate-spin" /> Creating order...</>
              ) : (
                <><MessageCircle className="w-5 h-5" /> Order via Messenger</>
              )}
            </button>

            <button
              onClick={clearOrder}
              disabled={submitting}
              className="w-full text-sm text-gray-400 hover:text-red-500 font-medium transition-colors"
            >
              Clear order list
            </button>
          </div>
        )}
      </div>
    </>
  );
};