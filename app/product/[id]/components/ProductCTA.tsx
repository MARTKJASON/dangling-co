'use client';

import React, { FC } from 'react';
import { MessageCircle, Loader, Truck } from 'lucide-react';
import { CategoryColor } from '../categoryConfig';

interface ProductCTAProps {
  color: CategoryColor;
  isMessageSent: boolean;
  onOrder: () => void;
}

export const ProductCTA: FC<ProductCTAProps> = ({ color, isMessageSent, onOrder }) => {
  return (
    <div className="space-y-3 pt-1">
      <button
        onClick={onOrder}
        className={`w-full flex items-center justify-center gap-3 px-8 py-4 font-bold rounded-2xl transition-all duration-300 shadow-lg text-lg group ${
          isMessageSent
            ? 'bg-green-500 text-white'
            : `bg-gradient-to-r ${color.gradient} text-white hover:shadow-xl hover:scale-[1.02] active:scale-100`
        }`}
      >
        {isMessageSent ? (
          <>
            <Loader className="w-5 h-5 animate-spin" />
            Redirecting to Messenger...
          </>
        ) : (
          <>
            <MessageCircle className="w-5 h-5 group-hover:scale-110 transition-transform" />
            Message Us to Order
          </>
        )}
      </button>

      <div className="flex items-start gap-3 p-4 rounded-2xl bg-white/60 backdrop-blur-sm border border-amber-100 shadow-sm">
        <Truck className="w-5 h-5 text-purple-500 flex-shrink-0 mt-0.5" />
        <p className="text-sm text-gray-600 font-medium leading-relaxed">
          Each piece is <strong className="text-gray-800">one-of-a-kind</strong> and made to order.{' '}
          <strong className="text-gray-800">Estimated delivery:</strong> 2–5 business days depending on location.
        </p>
      </div>
    </div>
  );
};