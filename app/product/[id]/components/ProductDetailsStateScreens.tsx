'use client';

import React, { FC } from 'react';
import Link from 'next/link';
import { AlertCircle, SearchX } from 'lucide-react';
import { SiteHeader } from '@/app/components/layout/SiteHeader';

const Shell: FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="min-h-screen flex flex-col">
    <SiteHeader active="shop" />
    {children}
  </div>
);

/** Skeleton in the same shape as the real page, so nothing jumps when it loads. */
export const LoadingScreen: FC = () => (
  <Shell>
    <main className="w-full max-w-[1200px] mx-auto px-4 md:px-8 pt-0 md:pt-6 pb-16" aria-busy="true" aria-label="Loading product">
      <div className="skeleton hidden md:block h-4 w-56 rounded-full mb-6" />
      <div className="flex flex-col md:flex-row gap-6 md:gap-14">
        <div className="skeleton -mx-4 md:mx-0 aspect-[4/5] md:rounded-[28px] md:flex-[1_1_520px]" />
        <div className="flex flex-col gap-4 md:flex-[1_1_400px]">
          <div className="skeleton h-3 w-28 rounded-full" />
          <div className="skeleton h-10 w-4/5 rounded-xl" />
          <div className="skeleton h-7 w-24 rounded-full" />
          <div className="skeleton h-20 w-full rounded-xl mt-2" />
          <div className="skeleton h-14 w-full rounded-full mt-4" />
        </div>
      </div>
    </main>
  </Shell>
);

const Message: FC<{ icon: React.ReactNode; title: string; body: string; action?: React.ReactNode }> = ({ icon, title, body, action }) => (
  <Shell>
    <main className="flex-1 flex items-center justify-center px-4 py-20">
      <div className="flex flex-col items-center text-center gap-3 max-w-md animate-fade-up">
        {icon}
        <h1 className="font-display text-3xl font-semibold">{title}</h1>
        <p className="text-ink-600">{body}</p>
        <div className="flex flex-wrap justify-center gap-2 mt-3">
          {action}
          <Link href="/shop" className="btn btn-secondary">Back to the shop</Link>
        </div>
      </div>
    </main>
  </Shell>
);

export const ErrorScreen: FC<{ message: string; onRetry?: () => void }> = ({ message, onRetry }) => (
  <Message
    icon={<span className="w-16 h-16 rounded-full bg-cherry-100 text-cherry-700 flex items-center justify-center"><AlertCircle className="w-7 h-7" strokeWidth={1.8} aria-hidden /></span>}
    title="We couldn’t load this piece"
    body={message}
    action={onRetry && <button type="button" onClick={onRetry} className="btn btn-primary">Try again</button>}
  />
);

export const NotFoundScreen: FC = () => (
  <Message
    icon={<span className="w-16 h-16 rounded-full bg-peri-50 text-peri-600 flex items-center justify-center"><SearchX className="w-7 h-7" strokeWidth={1.8} aria-hidden /></span>}
    title="This piece rolled away"
    body="It may have sold out or been taken down. There’s plenty more in the shop."
  />
);
