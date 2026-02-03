import React, { FC } from 'react';
import { LogOut, User } from 'lucide-react';

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
  return (
    <div className="sticky top-0 z-40 backdrop-blur-xl bg-white/80 border-b border-purple-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-4 md:py-6">
        <div className="flex items-center justify-between gap-4">
          {/* Left side - Logo */}
          <div className="flex items-center gap-3">
            <div className="flex gap-1">
              <div className="w-3 h-3 rounded-full bg-gradient-to-br from-purple-400 to-pink-300 shadow-md" />
              <div className="w-3 h-3 rounded-full bg-gradient-to-br from-blue-400 to-cyan-300 shadow-md" />
              <div className="w-3 h-3 rounded-full bg-gradient-to-br from-amber-400 to-orange-300 shadow-md" />
            </div>
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-purple-600 via-pink-500 to-orange-400 bg-clip-text text-transparent">
              Merchant Dashboard
            </h1>
          </div>

          {/* Right side - User Info */}
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm font-semibold text-gray-800">{userName}</p>
              <p className="text-xs text-gray-500">{userEmail}</p>
            </div>

            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center overflow-hidden border-2 border-purple-200">
              {userAvatar ? (
                <img src={userAvatar} alt={userName} className="w-full h-full object-cover" />
              ) : (
                <User className="w-6 h-6 text-white" />
              )}
            </div>

            <button
              onClick={onSignOut}
              disabled={loading}
              className="flex items-center gap-2 px-4 py-2 bg-red-50 hover:bg-red-100 text-red-700 font-semibold rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              title="Sign out"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Sign Out</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};