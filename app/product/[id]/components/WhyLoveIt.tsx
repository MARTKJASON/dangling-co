'use client';

import React, { FC } from 'react';
import { Sparkles } from 'lucide-react';
import { CategoryColor } from '../categoryConfig';

const FEATURES = [
  'Handcrafted with love & attention to detail',
  'Premium quality beads & materials',
  'Fully customizable to your style',
  'Perfect gift for someone special',
  'Made to order with care',
];

interface WhyLoveItProps {
  color: CategoryColor;
}

export const WhyLoveIt: FC<WhyLoveItProps> = ({ color }) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
        <Sparkles className="w-5 h-5 text-amber-500" />
        Why you'll love it
      </h3>
      <div className="grid grid-cols-1 gap-2.5">
        {FEATURES.map((item, i) => (
          <div
            key={i}
            className="flex items-center gap-3 px-4 py-3 bg-white/70 backdrop-blur-sm rounded-xl border border-white shadow-sm"
          >
            <div className={`flex-shrink-0 w-2 h-2 rounded-full bg-gradient-to-r ${color.gradient}`} />
            <span className="text-sm md:text-base text-gray-700 font-medium">{item}</span>
          </div>
        ))}
      </div>
    </div>
  );
};