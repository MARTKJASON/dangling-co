import React, { FC } from 'react';
import Link from 'next/link';
import { Logo } from '../brand/Logo';
import { BasketButton } from '../basket/BasketButton';

interface SiteHeaderProps {
  /** Which main nav item is current. */
  active?: 'shop' | 'how' | 'reviews';
  /** Optional slot between the nav and the basket, e.g. the shop's search field (desktop only). */
  children?: React.ReactNode;
}

const NAV = [
  { id: 'shop', href: '/shop', label: 'Shop' },
  { id: 'how', href: '/#how', label: 'How to order' },
  { id: 'reviews', href: '/#reviews', label: 'Reviews' },
] as const;

/** The single sticky bar used on every customer page. */
export const SiteHeader: FC<SiteHeaderProps> = ({ active, children }) => (
  <header className="sticky top-0 z-30 bg-cream-100/90 backdrop-blur-md border-b border-cream-300">
    <div className="max-w-[1200px] mx-auto h-14 md:h-[68px] pl-4 pr-2 md:px-8 flex items-center gap-4 md:gap-7">
      <Link href="/" aria-label="Dangling Co. home" className="rounded-full">
        <Logo />
      </Link>

      <nav aria-label="Main" className="hidden md:flex items-center gap-6">
        {NAV.map((item) => (
          <Link
            key={item.id}
            href={item.href}
            aria-current={active === item.id ? 'page' : undefined}
            className={`py-2.5 px-1 text-[15px] font-medium text-ink-900 border-b-2 transition-colors duration-200 ${
              active === item.id ? 'border-peri-600' : 'border-transparent hover:border-peri-300'
            }`}
          >
            {item.label}
          </Link>
        ))}
      </nav>

      <div className="flex-1 flex justify-end min-w-0">
        {children && <div className="hidden md:block w-full max-w-[420px]">{children}</div>}
      </div>

      <BasketButton />
    </div>
  </header>
);
