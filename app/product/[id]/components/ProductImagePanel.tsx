'use client';

import React, { FC } from 'react';
import { Gem, Palette } from 'lucide-react';
import { CategoryColor } from '../categoryConfig';

interface ProductImagePanelProps {
  imageUrl: string;
  name: string;
  price: string;
  color: CategoryColor;
}

export const ProductImagePanel: FC<ProductImagePanelProps> = ({ imageUrl, name, price, color }) => {
  return (
    <div className="flex items-start justify-center">
      <div className="relative w-full max-w-md">
        {/* Glow halo */}
        <div className={`absolute -inset-4 bg-gradient-to-r ${color.gradient} rounded-3xl opacity-20 blur-2xl`} />

        {/* Image card */}
        <div className="relative bg-white rounded-3xl overflow-hidden shadow-2xl border-2 border-white">
          <div className="aspect-square overflow-hidden">
            <img
              src={imageUrl}
              alt={name}
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-700 ease-out"
            />
          </div>

          {/* Price badge overlaid on image */}
          <div className="absolute bottom-4 left-4">
            <div className={`px-4 py-2 bg-gradient-to-r ${color.gradient} rounded-full shadow-lg`}>
              <p className="text-white font-black text-lg tracking-wide">₱{price}</p>
            </div>
          </div>
        </div>

        {/* Floating badges below image */}
        <div className="flex justify-center gap-3 mt-5 flex-wrap">
          {[
            { icon: <Palette className="w-4 h-4" />, label: 'Customizable' },
            { icon: '✋', label: 'Handmade' },
            { icon: <Gem className="w-4 h-4" />, label: 'Premium' },
          ].map((badge, i) => (
            <div
              key={i}
              className="flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full border border-amber-200 shadow-sm text-sm font-semibold text-gray-700"
            >
              <span className={typeof badge.icon === 'string' ? 'text-base' : color.text}>
                {badge.icon}
              </span>
              {badge.label}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};