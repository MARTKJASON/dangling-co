'use client';

import React, { FC, useState } from 'react';
import { LogOut, User, Menu, X } from 'lucide-react';

interface UserHeaderProps {
  userName: string;
  userEmail: string;
  userAvatar?: string;
  onSignOut: () => void;
  loading?: boolean;
}

export const UserHeader: FC<UserHeaderProps> = ({
  userName,
  userEmail,
  userAvatar,
  onSignOut,
  loading = false,
}) => {
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const handleSignOut = () => {
    setShowMobileMenu(false);
    onSignOut();
  };

  return (
    <div className="sticky top-0 z-40 backdrop-blur-xl bg-white/95 border-b border-purple-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4 lg:py-6">
        <div className="flex items-center justify-between gap-3 sm:gap-4">
          {/* Left side - Logo */}
          <div className="flex items-center gap-3 min-w-0">
            <div className="flex gap-1 flex-shrink-0">
              <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-gradient-to-br from-purple-400 to-pink-300 shadow-md" />
              <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-gradient-to-br from-blue-400 to-cyan-300 shadow-md" />
              <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-gradient-to-br from-amber-400 to-orange-300 shadow-md" />
            </div>
            <h1 className="hidden sm:block text-xl lg:text-2xl xl:text-3xl font-bold bg-gradient-to-r from-purple-600 via-pink-500 to-orange-400 bg-clip-text text-transparent truncate">
              Dashboard
            </h1>
          </div>

          {/* Desktop - User Info + Sign Out */}
          <div className="hidden sm:flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm font-semibold text-gray-800 truncate">{userName}</p>
              <p className="text-xs text-gray-500 truncate">{userEmail}</p>
            </div>

            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center overflow-hidden border-2 border-purple-200 flex-shrink-0">
              {userAvatar ? (
                <img src={userAvatar} alt={userName} className="w-full h-full object-cover" />
              ) : (
                <User className="w-6 h-6 text-white" />
              )}
            </div>

            <button
              onClick={onSignOut}
              disabled={loading}
              className="flex items-center gap-2 px-4 py-2 bg-red-50 hover:bg-red-100 text-red-700 font-semibold rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-md active:scale-95 whitespace-nowrap"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </button>
          </div>

          {/* Mobile - Menu Button */}
          <button
            onClick={() => setShowMobileMenu(!showMobileMenu)}
            className="sm:hidden p-2 hover:bg-purple-50 rounded-lg transition-colors"
          >
            {showMobileMenu ? (
              <X className="w-6 h-6 text-gray-700" />
            ) : (
              <Menu className="w-6 h-6 text-gray-700" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {showMobileMenu && (
          <div className="sm:hidden mt-4 pt-4 border-t border-purple-100 space-y-4 animate-in fade-in slide-in-from-top-2">
            {/* User Info */}
            <div className="px-4 py-3 bg-purple-50 rounded-lg">
              <p className="text-sm font-semibold text-gray-800 truncate">{userName}</p>
              <p className="text-xs text-gray-600 truncate">{userEmail}</p>
            </div>

            {/* Sign Out Button */}
            <button
              onClick={handleSignOut}
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-red-50 hover:bg-red-100 text-red-700 font-semibold rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95"
            >
              <LogOut className="w-5 h-5" />
              <span>Sign Out</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};