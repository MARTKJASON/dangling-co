'use client';

import React, { FC } from 'react';
import { CategoryColor } from '../categoryConfig';

interface DescriptionBlockProps {
  text: string;
  color: CategoryColor;
}

export const DescriptionBlock: FC<DescriptionBlockProps> = ({ text, color }) => {
  const lines = text.split('\n').filter((l) => l.trim() !== '');

  return (
    <div className={`p-5 rounded-2xl ${color.bg} border ${color.border}`}>
      <p className={`text-xs font-bold uppercase tracking-widest ${color.text} mb-3`}>
        About this piece
      </p>
      <div className="space-y-2">
        {lines.map((line, i) => {
          const isBullet = /^[-•*]\s+/.test(line.trim());
          const content = isBullet ? line.trim().replace(/^[-•*]\s+/, '') : line;

          if (isBullet) {
            return (
              <div key={i} className="flex items-start gap-3">
                <div className={`mt-2 flex-shrink-0 w-2 h-2 rounded-full bg-gradient-to-r ${color.gradient}`} />
                <p className="text-base md:text-lg text-gray-700 leading-relaxed">{content}</p>
              </div>
            );
          }

          return (
            <p key={i} className="text-base md:text-lg text-gray-700 leading-relaxed">
              {content}
            </p>
          );
        })}
      </div>
    </div>
  );
};