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
    <div className="sticky top-0 z-40 backdrop-blur-xl bg-white/80 border-b border-purple-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-4 md:py-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="flex gap-1">
            <div className="w-3 h-3 rounded-full bg-gradient-to-br from-purple-400 to-pink-300 shadow-md" />
            <div className="w-3 h-3 rounded-full bg-gradient-to-br from-blue-400 to-cyan-300 shadow-md" />
            <div className="w-3 h-3 rounded-full bg-gradient-to-br from-amber-400 to-orange-300 shadow-md" />
          </div>
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-purple-600 via-pink-500 to-orange-400 bg-clip-text text-transparent">
            {title}
          </h1>
        </div>
        <p className="text-sm md:text-base text-gray-600 ml-6">{subtitle}</p>
      </div>
    </div>
  );
};