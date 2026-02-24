'use client';

import React, { FC } from 'react';
import { Plus, Check } from 'lucide-react';
import { useOrderStore } from '@/app/store/useOrderStore';
import { Product } from '@/app/lib/products';

interface AddToOrderButtonProps {
  product: Product;
  className?: string;
  variant?: 'full' | 'icon'; // full = text + icon, icon = icon only
}

export const AddToOrderButton: FC<AddToOrderButtonProps> = ({
  product,
  className = '',
  variant = 'full',
}) => {
  const { addItem, isInOrder } = useOrderStore();
  const inOrder = isInOrder(product.id);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault(); // prevent Link navigation if button is inside a Link
    e.stopPropagation();
    addItem(product);
  };

  if (variant === 'icon') {
    return (
      <button
        onClick={handleClick}
        className={`w-9 h-10 flex items-center justify-center rounded-full transition-all duration-300 shadow-md ${
          inOrder
            ? 'bg-green-500 text-white scale-110'
            : 'bg-white text-purple-600 hover:bg-purple-50 border border-purple-200'
        } ${className}`}
        title={inOrder ? 'Added to order list' : 'Add to order list'}
      >
        {inOrder ? <Check className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
      </button>
    );
  }

  return (
    <button
      onClick={handleClick}
      className={`flex items-center justify-center gap-2 px-4 py-2.5 font-bold text-sm rounded-xl transition-all duration-300 ${
        inOrder
          ? 'bg-green-500 text-white shadow-green-200 shadow-lg'
          : 'bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600 shadow-lg hover:shadow-purple-200 hover:scale-[1.02]'
      } ${className}`}
    >
      {inOrder ? (
        <><Check className="w-4 h-4" /> Added</>
      ) : (
        <><Plus className="w-4 h-4" /> Add to Basket</>
      )}
    </button>
  );
};