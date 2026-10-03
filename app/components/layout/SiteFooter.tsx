import React, { FC } from 'react';
import Link from 'next/link';
import { Logo } from '../brand/Logo';
import { CATEGORIES, categorySlug } from '@/app/lib/categories';

export const INSTAGRAM_URL = 'https://www.instagram.com/dangling_co';
export const FACEBOOK_URL = 'https://www.facebook.com/profile.php?id=61577634874235';

export const SiteFooter: FC = () => (
  <footer className="bg-peri-700 text-white">
    <div className="max-w-[1200px] mx-auto px-4 md:px-8 pt-14 pb-10 flex flex-col gap-9">
      <div className="flex flex-wrap gap-8 justify-between items-start">
        <div className="flex flex-col gap-2.5 max-w-xs">
          <Logo tone="light" />
          <p className="text-[15px] text-peri-100">Handcrafted beaded jewelry. Each piece is made to order.</p>
        </div>

        <nav aria-label="Footer" className="flex flex-wrap gap-12 text-[15px]">
          <div className="flex flex-col gap-2.5">
            <span className="eyebrow !text-peri-100">Shop</span>
            {CATEGORIES.map((c) => (
              <Link key={c.id} href={`/shop?category=${categorySlug(c.id)}`} className="hover:text-butter-400 transition-colors">
                {c.label}
              </Link>
            ))}
          </div>
          <div className="flex flex-col gap-2.5">
            <span className="eyebrow !text-peri-100">Follow</span>
            <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" className="hover:text-butter-400 transition-colors">Instagram</a>
            <a href={FACEBOOK_URL} target="_blank" rel="noopener noreferrer" className="hover:text-butter-400 transition-colors">Facebook</a>
          </div>
        </nav>
      </div>
      <div className="border-t border-peri-600 pt-5 text-[13px] text-peri-100">
        © {new Date().getFullYear()} Dangling Co.
      </div>
    </div>
  </footer>
);
