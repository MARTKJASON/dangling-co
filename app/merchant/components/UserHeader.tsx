'use client';

import React, { FC, ReactNode } from 'react';
import { LogOut, User } from 'lucide-react';
import { FlowerMark, Logo } from '@/app/components/brand/Logo';

interface UserHeaderProps {
  userName: string;
  userEmail: string;
  userAvatar?: string;
  onSignOut: () => void;
  loading?: boolean;
  /** Optional navigation (e.g. dashboard tabs) rendered inside the header bar. */
  children?: ReactNode;
}

export const UserHeader: FC<UserHeaderProps> = ({
  userName,
  userEmail,
  userAvatar,
  onSignOut,
  loading = false,
  children,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white border-b border-cream-300">
      <div className="max-w-[1200px] mx-auto px-4 md:px-8 flex flex-wrap items-center gap-x-8">
        {/* Brand */}
        <div className="order-1 flex items-center gap-2.5 h-16 min-w-0">
          <span className="sm:hidden text-peri-500">
            <FlowerMark size={28} />
            <span className="sr-only">Dangling Co.</span>
          </span>
          <span className="hidden sm:inline-flex">
            <Logo size="sm" />
          </span>
          <span className="px-2 py-1 rounded-md bg-cream-200 text-ink-600 text-xs font-semibold uppercase tracking-[0.08em]">
            Merchant
          </span>
        </div>

        {/* Tabs: own row on mobile, inline on desktop */}
        {children && (
          <div className="order-3 md:order-2 w-[calc(100%+2rem)] md:w-auto h-12 md:h-16 self-stretch -mx-4 px-4 md:mx-0 md:px-0 border-t border-cream-200 md:border-t-0 overflow-x-auto no-scrollbar">
            {children}
          </div>
        )}

        {/* Account */}
        <div className="order-2 md:order-3 ml-auto flex items-center gap-3 h-16">
          <div className="hidden lg:block text-right min-w-0 max-w-[220px]">
            <p className="text-sm font-semibold text-ink-900 truncate">{userName}</p>
            <p className="text-[13px] text-ink-600 truncate">{userEmail}</p>
          </div>

          <div
            className="hidden sm:flex w-9 h-9 rounded-full bg-peri-100 items-center justify-center overflow-hidden flex-shrink-0"
            title={`${userName} (${userEmail})`}
          >
            {userAvatar ? (
              <img src={userAvatar} alt="" className="w-full h-full object-cover" />
            ) : (
              <User className="w-5 h-5 text-peri-700" aria-hidden="true" />
            )}
          </div>

          <button
            type="button"
            onClick={onSignOut}
            disabled={loading}
            className="btn btn-secondary btn-sm"
          >
            <LogOut className="w-4 h-4" aria-hidden="true" />
            Sign out
          </button>
        </div>
      </div>
    </header>
  );
};
