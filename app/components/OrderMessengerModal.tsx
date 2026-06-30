'use client';

import React, { FC, useMemo, useState } from 'react';
import { X, Check, MessageCircle, ExternalLink, Copy } from 'lucide-react';
import { OrderItem } from '../lib/order';
import { buildOrderMessage, copyToClipboard, MESSENGER_URL } from '../lib/orderMessage';

interface OrderMessengerModalProps {
  open: boolean;
  onClose: () => void;
  orderRef: string;
  items: OrderItem[];
  totalPrice: number;
}

/**
 * Single-step checkout modal.
 *
 * Shows the order summary + generated Messenger message, then copies the
 * message and opens Messenger in one tap — so the customer only has to paste.
 */
export const OrderMessengerModal: FC<OrderMessengerModalProps> = ({
  open,
  onClose,
  orderRef,
  items,
  totalPrice,
}) => {
  const [copied, setCopied] = useState(false);

  const messageText = useMemo(
    () => buildOrderMessage(orderRef, items, totalPrice),
    [orderRef, items, totalPrice],
  );

  if (!open) return null;

  const handleCopyAndOpen = () => {
    // Fire the copy and open Messenger within the same user gesture so mobile
    // browsers don't block the navigation as an unsolicited popup.
    copyToClipboard(messageText);
    setCopied(true);
    window.open(MESSENGER_URL, '_blank', 'noopener,noreferrer');
  };

  return (
    <>
      {/* Backdrop — sits above the drawer */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60]"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-[70] flex items-end sm:items-center justify-center p-0 sm:p-4 pointer-events-none">
        <div className="pointer-events-auto w-full sm:max-w-md bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl flex flex-col max-h-[90vh] animate-in slide-in-from-bottom sm:fade-in duration-300">

          {/* Header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-purple-100 bg-gradient-to-r from-purple-50 to-pink-50 rounded-t-3xl">
            <div className="flex items-center gap-2">
              <MessageCircle className="w-5 h-5 text-purple-600" />
              <h2 className="text-lg font-bold text-gray-900">Confirm your order</h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-gray-400 hover:text-gray-600 hover:bg-white transition-all"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Scrollable body */}
          <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">

            {/* Order ref */}
            <div className="text-center space-y-1">
              <p className="text-xs font-bold uppercase tracking-widest text-purple-400">
                Order Reference
              </p>
              <p className="text-2xl font-black tracking-widest bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">
                {orderRef}
              </p>
            </div>

            {/* Product details */}
            <div className="space-y-2.5">
              {items.map((item) => (
                <div
                  key={item.product.id}
                  className="flex gap-3 p-3 bg-gray-50 rounded-2xl border border-purple-100"
                >
                  <img
                    src={item.product.image_url}
                    alt={item.product.name}
                    className="w-14 h-14 rounded-xl object-cover flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-gray-900 line-clamp-1">
                      {item.product.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      ₱{item.product.price} × {item.quantity}
                    </p>
                    {item.note?.trim() && (
                      <p className="text-xs text-purple-500 mt-0.5 line-clamp-1">
                        ↳ {item.note.trim()}
                      </p>
                    )}
                  </div>
                  <span className="text-sm font-black text-purple-700 self-center whitespace-nowrap">
                    ₱{(parseFloat(item.product.price) * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>

            {/* Total */}
            <div className="flex items-center justify-between px-1">
              <span className="text-sm font-semibold text-gray-600">Total</span>
              <span className="text-xl font-black bg-gradient-to-r from-amber-600 to-orange-500 bg-clip-text text-transparent">
                ₱{totalPrice.toFixed(2)}
              </span>
            </div>

            {/* Generated message preview */}
            <div className="bg-purple-50 rounded-2xl p-4 border border-purple-100">
              <p className="text-xs font-bold uppercase tracking-widest text-purple-400 mb-2">
                Message to send
              </p>
              <pre className="text-sm text-gray-700 whitespace-pre-wrap font-sans leading-relaxed">
                {messageText}
              </pre>
            </div>
          </div>

          {/* Footer — single action */}
          <div className="px-5 py-4 border-t border-purple-100 bg-white space-y-2">
            <button
              onClick={handleCopyAndOpen}
              className={`w-full flex items-center justify-center gap-2 px-6 py-4 font-bold rounded-2xl shadow-lg transition-all hover:scale-[1.02] active:scale-100 text-base ${
                copied
                  ? 'bg-green-500 text-white'
                  : 'bg-[#0866FF] hover:bg-[#0757E0] text-white'
              }`}
            >
              {copied ? (
                <><Check className="w-5 h-5" /> Copied! Opening Messenger…</>
              ) : (
                <><Copy className="w-5 h-5" /> Copy Message &amp; Open Messenger <ExternalLink className="w-4 h-4 opacity-70" /></>
              )}
            </button>
            <p className="text-center text-xs text-gray-400">
              Just paste the message in Messenger and hit send 💬
            </p>
          </div>
        </div>
      </div>
    </>
  );
};
