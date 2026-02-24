'use client';

import React, { FC, useState, useEffect } from 'react';
import { ShoppingBag } from 'lucide-react';
import { useOrderStore } from '../store/useOrderStore';
import { OrderListDrawer } from './OrderListDrawer';

export const OrderListFAB: FC = () => {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { totalItems } = useOrderStore();

  useEffect(() => {
    setMounted(true); // runs only on the client
  }, []);

  const count = mounted ? totalItems() : 0;

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 z-30 flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold rounded-full shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300"
        aria-label="Open order list"
      >
        <ShoppingBag className="w-5 h-5" />
        <span className="text-sm">Order List</span>
        {count > 0 && (
          <span className="flex items-center justify-center w-5 h-5 bg-white text-purple-600 text-xs font-black rounded-full">
            {count}
          </span>
        )}
      </button>

      <OrderListDrawer open={open} onClose={() => setOpen(false)} />
    </>
  );
};