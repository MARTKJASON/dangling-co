'use client';

import React, { useState, FC, useRef, useEffect, useMemo, useCallback, memo } from 'react';
import { Sparkles, Search, ChevronLeft, ChevronRight, Instagram, Facebook, X } from 'lucide-react';
import CategoryTabs, { Category } from '../components/CategoryTabs';
import ProductCard from '../components/ProductCard';
import { useRouter } from 'next/navigation';
import { useProducts } from '../hooks/useProducts';
import { OrderListFAB } from '../components/OrderListFAB';

// ── Category config ────────────────────────────────────────────────────────
const CATEGORIES: Category[] = ['keychain', 'necklace', 'bracelet / anklet', 'magnet'];

const CATEGORY_STYLE: Record<string, { emoji: string; label: string; bar: string }> = {
  necklace:            { emoji: '✨', label: 'Necklaces',           bar: 'from-purple-200' },
  'bracelet / anklet': { emoji: '🌀', label: 'Bracelets & Anklets', bar: 'from-blue-200' },
  keychain:            { emoji: '🔑', label: 'Keychains',           bar: 'from-amber-200' },
  magnet:              { emoji: '🧲', label: 'Magnets',             bar: 'from-green-200' },
};

// ── Skeleton card ──────────────────────────────────────────────────────────
const SkeletonCard: FC = () => (
  <div className="rounded-2xl overflow-hidden bg-white border border-purple-100 shadow-sm animate-pulse">
    <div className="h-44 sm:h-52 bg-gradient-to-br from-purple-100 to-pink-100" />
    <div className="p-3 space-y-2">
      <div className="h-3 bg-purple-100 rounded-full w-3/4" />
      <div className="h-3 bg-purple-50 rounded-full w-1/2" />
      <div className="h-4 bg-amber-100 rounded-full w-1/3 mt-2" />
    </div>
  </div>
);

// ── Social link button ─────────────────────────────────────────────────────
const SocialLink: FC<{ href: string; icon: React.ReactNode; label: string; className: string }> = memo(
  ({ href, icon, label, className }) => (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className={"flex items-center gap-2 px-4 py-2.5 rounded-full font-semibold text-sm text-white transition-all duration-300 hover:scale-105 active:scale-95 shadow-md hover:shadow-lg " + className}
    >
      {icon}
      <span className="hidden sm:inline">{label}</span>
    </a>
  )
);
SocialLink.displayName = 'SocialLink';

// ── Store page ─────────────────────────────────────────────────────────────
const StorePage: FC = () => {
  const [activeCategory, setActiveCategory] = useState<Category>('keychain');
  const [searchQuery, setSearchQuery]       = useState('');
  const [isAnimating, setIsAnimating]       = useState(false);
  const [showSwipeHint, setShowSwipeHint]   = useState(true);
  const [searchFocused, setSearchFocused]   = useState(false);

  const { products, loading, error, loadProducts } = useProducts();
  const router = useRouter();

  const touchStartX = useRef(0);
  const touchStartY = useRef(0);

  useEffect(() => { loadProducts(); }, [loadProducts]);

  useEffect(() => {
    const t = setTimeout(() => setShowSwipeHint(false), 3500);
    return () => clearTimeout(t);
  }, []);

  // Memoised filter — avoids recompute on unrelated re-renders
  const filteredProducts = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    return products.filter(p => {
      if (p.category !== activeCategory) return false;
      if (!q) return true;
      return (
        p.name.toLowerCase().includes(q) ||
        (p.description?.toLowerCase().includes(q) ?? false)
      );
    });
  }, [products, activeCategory, searchQuery]);

  const handleCategoryChange = useCallback((cat: Category) => {
    if (cat === activeCategory || isAnimating) return;
    setIsAnimating(true);
    setActiveCategory(cat);
    setTimeout(() => setIsAnimating(false), 250);
  }, [activeCategory, isAnimating]);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    touchStartX.current = e.changedTouches[0].screenX;
    touchStartY.current = e.changedTouches[0].screenY;
  }, []);

  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    const dx = touchStartX.current - e.changedTouches[0].screenX;
    const dy = Math.abs(touchStartY.current - e.changedTouches[0].screenY);
    // Ignore vertical scroll gestures
    if (Math.abs(dx) < 50 || dy > Math.abs(dx)) return;
    setShowSwipeHint(false);
    if (isAnimating) return;
    const idx = CATEGORIES.indexOf(activeCategory);
    if (dx > 0 && idx < CATEGORIES.length - 1) handleCategoryChange(CATEGORIES[idx + 1]);
    if (dx < 0 && idx > 0) handleCategoryChange(CATEGORIES[idx - 1]);
  }, [activeCategory, isAnimating, handleCategoryChange]);

  const catStyle = CATEGORY_STYLE[activeCategory] ?? CATEGORY_STYLE.keychain;

  return (
    <div className="min-h-screen bg-[#faf7f2]">

      {/* ── Sticky header ────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-xl border-b border-purple-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">

          {/* Brand row */}
          <div className="flex items-center justify-between py-3 sm:py-4">
            <div className="flex items-center gap-2.5">
              <div className="flex gap-1 flex-shrink-0">
                <div className="w-2.5 h-2.5 rounded-full bg-gradient-to-br from-purple-400 to-pink-300" />
                <div className="w-2.5 h-2.5 rounded-full bg-gradient-to-br from-blue-400 to-cyan-300" />
                <div className="w-2.5 h-2.5 rounded-full bg-gradient-to-br from-amber-400 to-orange-300" />
              </div>
              <div>
                <h1 className="text-lg sm:text-2xl font-black bg-gradient-to-r from-purple-600 via-pink-500 to-orange-400 bg-clip-text text-transparent leading-none">
                  Dangling Co.
                </h1>
                <p className="text-[10px] sm:text-xs text-gray-400 font-medium hidden sm:block">
                  Handcrafted beaded jewelry
                </p>
              </div>
            </div>

            <button
              onClick={() => router.push('/customize')}
              className="flex items-center gap-1.5 px-4 sm:px-6 py-2 sm:py-2.5 bg-gradient-to-r from-purple-500 via-pink-500 to-orange-400 text-white font-bold text-xs sm:text-sm rounded-full shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 transition-all duration-300 whitespace-nowrap"
            >
              <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" style={{ animation: 'spin 3s linear infinite' }} />
              <span>Create Yours</span>
            </button>
          </div>

          {/* Search bar — compact, inside header */}
          <div className="pb-3 sm:pb-4">
            <div className={"relative transition-all duration-300" + (searchFocused ? ' scale-[1.01]' : '')}>
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              <input
                type="search"
                inputMode="search"
                autoComplete="off"
                placeholder="Search keychains, necklaces…"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                onFocus={() => setSearchFocused(true)}
                onBlur={() => setSearchFocused(false)}
                className="w-full pl-10 pr-9 py-2.5 bg-purple-50 border-2 border-transparent focus:border-purple-400 focus:bg-white rounded-full text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-200 transition-all duration-300"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 flex items-center justify-center rounded-full bg-gray-300 hover:bg-gray-400 transition-colors"
                  aria-label="Clear search"
                >
                  <X className="w-3 h-3 text-white" />
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* ── Category tabs (second sticky layer) ──────────────────────────── */}
      <div className="sticky top-[109px] sm:top-[124px] z-30 bg-[#faf7f2]/95 backdrop-blur-md border-b border-purple-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2.5">
          <CategoryTabs
            categories={CATEGORIES}
            active={activeCategory}
            onChange={handleCategoryChange}
          />
        </div>
      </div>

      {/* ── Main content ──────────────────────────────────────────────────── */}
      <main
        className="max-w-7xl mx-auto px-4 sm:px-6 py-5 sm:py-10"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {/* Category heading + count */}
        <div className="flex items-center gap-2.5 mb-5 sm:mb-7">
          <span className="text-xl" aria-hidden>{catStyle.emoji}</span>
          <h2 className={"text-lg sm:text-2xl font-black text-gray-800 transition-opacity duration-200 " + (isAnimating ? 'opacity-0' : 'opacity-100')}>
            {catStyle.label}
          </h2>
          {!loading && (
            <span className="ml-auto text-xs font-semibold text-gray-400 bg-white px-2.5 py-1 rounded-full border border-purple-100 shadow-sm">
              {filteredProducts.length} {filteredProducts.length === 1 ? 'item' : 'items'}
            </span>
          )}
        </div>

        {/* Swipe hint */}
        {showSwipeHint && !loading && (
          <div className="flex justify-center mb-4 md:hidden pointer-events-none">
            <div className="flex items-center gap-1.5 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-3.5 py-1.5 rounded-full text-[11px] font-semibold shadow-lg animate-bounce">
              <ChevronLeft className="w-3.5 h-3.5" />
              Swipe to browse categories
              <ChevronRight className="w-3.5 h-3.5" />
            </div>
          </div>
        )}

        {/* Loading skeletons */}
        {loading && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5 lg:gap-6">
            {Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        )}

        {/* Error */}
        {error && !loading && (
          <div className="flex flex-col items-center justify-center py-20 text-center px-4">
            <div className="text-5xl mb-4">⚠️</div>
            <h3 className="text-lg font-bold text-gray-800 mb-2">Couldn't load products</h3>
            <p className="text-sm text-gray-500 mb-6 max-w-xs">{error}</p>
            <button
              onClick={() => loadProducts()}
              className="px-6 py-2.5 bg-purple-500 hover:bg-purple-600 text-white font-semibold rounded-full transition-colors shadow-md"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Products grid */}
        {!loading && !error && filteredProducts.length > 0 && (
          <div className={"grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5 lg:gap-6 transition-opacity duration-200 " + (isAnimating ? 'opacity-0' : 'opacity-100')}>
            {filteredProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}

        {/* Empty state */}
        {!loading && !error && filteredProducts.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-center px-4">
            <div className="text-5xl mb-4">🔍</div>
            <h3 className="text-lg font-bold text-gray-800 mb-2">No results found</h3>
            <p className="text-sm text-gray-500 mb-5 max-w-xs">
              {searchQuery
                ? 'Nothing matched "' + searchQuery + '" in ' + catStyle.label.toLowerCase() + '.'
                : 'No ' + catStyle.label.toLowerCase() + ' yet. Check back soon!'
              }
            </p>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="px-5 py-2 bg-purple-100 hover:bg-purple-200 text-purple-700 font-semibold text-sm rounded-full transition-colors"
              >
                Clear search
              </button>
            )}
          </div>
        )}
      </main>

      {/* ── Footer ────────────────────────────────────────────────────────── */}
      <footer className="mt-10 border-t border-purple-100 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-10">

          <div className="flex flex-col sm:flex-row items-center sm:items-start justify-between gap-6">
            {/* Brand */}
            <div className="text-center sm:text-left">
              <div className="flex items-center justify-center sm:justify-start gap-2 mb-2">
                <div className="flex gap-1">
                  <div className="w-2.5 h-2.5 rounded-full bg-gradient-to-br from-purple-400 to-pink-300" />
                  <div className="w-2.5 h-2.5 rounded-full bg-gradient-to-br from-blue-400 to-cyan-300" />
                  <div className="w-2.5 h-2.5 rounded-full bg-gradient-to-br from-amber-400 to-orange-300" />
                </div>
                <span className="font-black text-lg bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">
                  Dangling Co.
                </span>
              </div>
              <p className="text-sm text-gray-500 max-w-[200px]">Handcrafted beaded jewelry made with love ✨</p>
              <p className="text-xs text-gray-400 mt-1">Each piece is made to order.</p>
            </div>

            {/* Social links — right side of footer */}
            <div className="flex flex-col items-center sm:items-end gap-3">
              <p className="text-xs font-bold uppercase tracking-widest text-gray-400">Follow us</p>
              <div className="flex items-center gap-2.5">
                <SocialLink
                  href="https://www.instagram.com/dangling_co"
                  icon={<Instagram className="w-4 h-4" />}
                  label="Instagram"
                  className="bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400 hover:opacity-90"
                />
                <SocialLink
                  href="https://www.facebook.com/profile.php?id=61577634874235"
                  icon={<Facebook className="w-4 h-4" />}
                  label="Facebook"
                  className="bg-[#1877F2] hover:bg-[#1467d8]"
                />
              </div>
            </div>
          </div>

          <div className="my-6 h-px bg-gradient-to-r from-transparent via-purple-200 to-transparent" />

          <div className="flex flex-col items-center gap-4">
            <div className="flex items-center justify-center gap-5">
              {['✨', '🌀', '🔑', '🧲'].map((bead, i) => (
                <span key={i} className="text-2xl sm:text-3xl" style={{ animation: 'bounce 1s ease-in-out infinite', animationDelay: i * 0.15 + 's' }}>
                  {bead}
                </span>
              ))}
            </div>
            <p className="text-xs text-gray-400">© {new Date().getFullYear()} Dangling Co. · All rights reserved</p>
          </div>
        </div>
      </footer>

      <OrderListFAB />
    </div>
  );
};

export default StorePage;