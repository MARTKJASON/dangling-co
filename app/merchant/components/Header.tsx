'use client';

import React from 'react';

interface HeaderProps {
  title?: string;
  subtitle?: string;
}

export const Header: React.FC<HeaderProps> = ({
  title = 'Merchant Dashboard',
  subtitle = 'Manage your beaded jewelry collection',
}) => {
  return (
    <div className="sticky top-0 z-40 backdrop-blur-xl bg-white/95 border-b border-purple-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
        {/* Logo and Title */}
        <div className="flex items-start gap-3 mb-3 sm:mb-2">
          <div className="flex gap-1 flex-shrink-0">
            <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-gradient-to-br from-purple-400 to-pink-300 shadow-md" />
            <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-gradient-to-br from-blue-400 to-cyan-300 shadow-md" />
            <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-gradient-to-br from-amber-400 to-orange-300 shadow-md" />
          </div>
          <h1 className="text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-bold bg-gradient-to-r from-purple-600 via-pink-500 to-orange-400 bg-clip-text text-transparent leading-tight">
            {title}
          </h1>
        </div>
        
        {/* Subtitle */}
        <p className="text-xs sm:text-sm text-gray-600 pl-1 sm:pl-6">
          {subtitle}
        </p>
      </div>
    </div>
  );
};