'use client';

import React, { FC } from 'react';
import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { CategoryColor } from '../categoryConfig';

interface ProductDetailsNavProps {
  category: string;
  emoji: string;
  color: CategoryColor;
}

export const ProductDetailsNav: FC<ProductDetailsNavProps> = ({ category, emoji, color }) => {
  const router = useRouter();

  return (
    <div className="sticky top-0 z-40 backdrop-blur-lg bg-white/80 border-b border-amber-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-3.5 flex items-center justify-between">
        <button
          onClick={() => router.push('/store')}
          className="inline-flex items-center gap-2 px-4 py-2 text-purple-700 hover:text-purple-900 font-bold transition-all group hover:gap-3"
        >
          <ArrowLeft className="w-4 h-4 group-hover:scale-110 transition-transform" />
          Back to Collection
        </button>

        <div className={`hidden sm:flex items-center gap-2 px-4 py-1.5 rounded-full ${color.bg} ${color.text} ${color.border} border font-semibold text-sm`}>
          <span>{emoji}</span>
          <span>{category.charAt(0).toUpperCase() + category.slice(1)}</span>
        </div>
      </div>
    </div>
  );
};