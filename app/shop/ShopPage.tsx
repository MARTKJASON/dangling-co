'use client';

import React, { FC, useCallback, useEffect, useMemo, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { AlertCircle, Search, SearchX, X } from 'lucide-react';
import CategoryTabs, { Category } from '../components/CategoryTabs';
import ProductCard, { ProductCardSkeleton } from '../components/ProductCard';
import { SiteHeader } from '../components/layout/SiteHeader';
import { SiteFooter } from '../components/layout/SiteFooter';
import { MobileBasketBar } from '../components/basket/MobileBasketBar';
import { useProducts } from '../hooks/useProducts';
import { CATEGORIES, categoryFromSlug, categorySlug, getCategoryInfo } from '../lib/categories';

const SearchField: FC<{ id: string; value: string; onChange: (v: string) => void }> = ({ id, value, onChange }) => (
  <div className="relative">
    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-ink-600 pointer-events-none" aria-hidden />
    <label htmlFor={id} className="sr-only">Search the shop</label>
    <input
      id={id}
      type="search"
      inputMode="search"
      autoComplete="off"
      placeholder="Search keychains, necklaces…"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="field !min-h-11 !rounded-full !pl-11 !pr-11 [&::-webkit-search-cancel-button]:hidden"
    />
    {value && (
      <button
        type="button"
        onClick={() => onChange('')}
        aria-label="Clear search"
        className="absolute right-0.5 top-1/2 -translate-y-1/2 icon-btn !w-10 !h-10 text-ink-600"
      >
        <X className="w-4 h-4" aria-hidden />
      </button>
    )}
  </div>
);

const ShopPage: FC = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const activeCategory = categoryFromSlug(searchParams.get('category'));

  const [query, setQuery] = useState('');
  const { products, loading, error, loadProducts } = useProducts();

  useEffect(() => { loadProducts(); }, [loadProducts]);

  // The category lives in the URL so it can be linked to and survives Back.
  const setCategory = useCallback(
    (category: Category | null) => {
      const params = new URLSearchParams(searchParams.toString());
      if (category) params.set('category', categorySlug(category));
      else params.delete('category');
      const qs = params.toString();
      router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
    },
    [router, pathname, searchParams],
  );

  const searched = useMemo(() => {
    const q = query.toLowerCase().trim();
    if (!q) return products;
    return products.filter(
      (p) => p.name.toLowerCase().includes(q) || (p.description?.toLowerCase().includes(q) ?? false),
    );
  }, [products, query]);

  const visible = useMemo(
    () => (activeCategory ? searched.filter((p) => p.category === activeCategory) : searched),
    [searched, activeCategory],
  );

  const counts = useMemo(() => {
    const c: Partial<Record<Category | 'all', number>> = { all: searched.length };
    CATEGORIES.forEach((cat) => { c[cat.id] = searched.filter((p) => p.category === cat.id).length; });
    return c;
  }, [searched]);

  const categoryInfo = activeCategory ? getCategoryInfo(activeCategory) : undefined;
  const heading = categoryInfo?.label ?? 'Shop everything';
  const showGrid = !loading && !error && visible.length > 0;
  const showEmpty = !loading && !error && products.length > 0 && visible.length === 0;
  const noProductsYet = !loading && !error && products.length === 0;

  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader active="shop">
        <SearchField id="shop-search-desktop" value={query} onChange={setQuery} />
      </SiteHeader>

      <main className="flex-1 w-full max-w-[1200px] mx-auto px-4 md:px-8 pt-5 md:pt-12 pb-28 md:pb-24 flex flex-col gap-4 md:gap-7">
        <div className="flex flex-col gap-1.5 md:gap-2">
          <h1 className="font-display text-[32px] md:text-5xl leading-[1.05] font-semibold tracking-[-0.015em]">{heading}</h1>
          <p className="hidden md:block text-[17px] text-ink-600">Every piece is strung by hand when you order it.</p>
        </div>

        <div className="md:hidden">
          <SearchField id="shop-search-mobile" value={query} onChange={setQuery} />
        </div>

        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div className="min-w-0 max-w-full">
            <CategoryTabs active={activeCategory} onChange={setCategory} counts={loading ? undefined : counts} />
          </div>
          {!loading && !error && (
            <span className="text-[13px] md:text-sm text-ink-600 font-medium" aria-live="polite">
              {visible.length} {visible.length === 1 ? 'piece' : 'pieces'}
              {query.trim() && <> for “{query.trim()}”</>}
            </span>
          )}
        </div>

        {loading && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-3 gap-y-5 sm:gap-6">
            {Array.from({ length: 8 }).map((_, i) => <ProductCardSkeleton key={i} />)}
          </div>
        )}

        {error && !loading && (
          <div className="flex flex-col items-center text-center gap-2.5 py-16 px-4 bg-white rounded-sheet ring-1 ring-inset ring-cream-300">
            <span className="w-16 h-16 rounded-full bg-cherry-100 text-cherry-700 flex items-center justify-center">
              <AlertCircle className="w-7 h-7" strokeWidth={1.8} aria-hidden />
            </span>
            <h2 className="font-display text-2xl font-semibold">We couldn’t load the shop</h2>
            <p className="text-ink-600 max-w-sm">{error}</p>
            <button type="button" onClick={() => loadProducts(true)} className="btn btn-primary mt-2">Try again</button>
          </div>
        )}

        {showGrid && (
          <div
            // Re-keying replays the fade when the category or search changes, instead of blanking the grid.
            key={`${activeCategory ?? 'all'}|${query.trim()}`}
            className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-3 gap-y-5 sm:gap-6 animate-fade-up"
          >
            {visible.map((product, i) => (
              <ProductCard key={product.id} product={product} priority={i < 4} />
            ))}
          </div>
        )}

        {(showEmpty || noProductsYet) && (
          <div className="flex flex-col items-center text-center gap-2.5 py-16 px-4 bg-white rounded-sheet ring-1 ring-inset ring-cream-300">
            <span className="w-16 h-16 rounded-full bg-peri-50 text-peri-600 flex items-center justify-center">
              <SearchX className="w-7 h-7" strokeWidth={1.8} aria-hidden />
            </span>
            <h2 className="font-display text-2xl font-semibold">
              {query.trim() ? 'Nothing matched your search' : noProductsYet ? 'New pieces are on the way' : `No ${categoryInfo?.label.toLowerCase()} right now`}
            </h2>
            <p className="text-ink-600 max-w-sm">
              {query.trim()
                ? `We couldn’t find “${query.trim()}”${categoryInfo ? ` in ${categoryInfo.label.toLowerCase()}` : ''}.`
                : 'Message us if you’d like one made just for you.'}
            </p>
            <div className="flex flex-wrap justify-center gap-2 mt-2">
              {query.trim() && <button type="button" onClick={() => setQuery('')} className="btn btn-secondary">Clear search</button>}
              {activeCategory && <button type="button" onClick={() => setCategory(null)} className="btn btn-secondary">See all pieces</button>}
            </div>
          </div>
        )}
      </main>

      <SiteFooter />
      <MobileBasketBar />
    </div>
  );
};

export default ShopPage;
