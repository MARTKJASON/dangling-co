'use client';

import React from 'react';
import { Logo } from '@/app/components/brand/Logo';

interface HeaderProps {
  title?: string;
  subtitle?: string;
}

export const Header: React.FC<HeaderProps> = ({
  title = 'Merchant Dashboard',
  subtitle = 'Manage your beaded jewelry collection',
}) => {
  return (
    <div className="sticky top-0 z-40 bg-white border-b border-cream-300">
      <div className="max-w-[1200px] mx-auto px-4 md:px-8 py-4 space-y-3">
        <Logo size="sm" />
        <div className="space-y-1">
          <h1 className="font-display text-2xl sm:text-3xl font-semibold text-ink-900">{title}</h1>
          <p className="text-sm text-ink-600">{subtitle}</p>
        </div>
      </div>
    </div>
  );
};
