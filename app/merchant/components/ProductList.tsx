'use client';

import React, { useMemo } from 'react';
import { Search, X, PackageOpen } from 'lucide-react';
import { ProductCard } from './ProductCard';
import { Category } from '@/app/lib/products';
import { getCategoryInfo } from '@/app/lib/categories';
import { Product } from '@/app/types/product';

interface ProductListProps {
  products: Product[];
  categories: Category[];
  loading: boolean;
  searchQuery: string;
  activeCategory: Category;
  onSearchChange: (query: string) => void;
  onCategoryChange: (category: Category) => void;
  onEdit: (product: Product) => void;
  onDelete: (id: string, imageUrl: string) => void;
}

export const ProductList: React.FC<ProductListProps> = ({
  products,
  categories,
  loading,
  searchQuery,
  activeCategory,
  onSearchChange,
  onCategoryChange,
  onEdit,
  onDelete,
}) => {
  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => p.category === activeCategory)
      .filter(
        (p) =>
          p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.description.toLowerCase().includes(searchQuery.toLowerCase()),
      );
  }, [products, activeCategory, searchQuery]);

  const productCount = filteredProducts.length;
  const activeLabel = getCategoryInfo(activeCategory)?.label ?? activeCategory;

  return (
    <div className="space-y-5">
      {/* Search */}
      <div className="relative">
        <label htmlFor="product-search" className="sr-only">Search products</label>
        <Search
          className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-ink-500 pointer-events-none"
          aria-hidden="true"
        />
        <input
          id="product-search"
          type="search"
          placeholder="Search products…"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="field pl-11 pr-12 rounded-full"
        />
        {searchQuery && (
          <button
            type="button"
            onClick={() => onSearchChange('')}
            aria-label="Clear search"
            className="icon-btn absolute right-1 top-1/2 -translate-y-1/2 text-ink-600"
          >
            <X className="w-5 h-5" aria-hidden="true" />
          </button>
        )}
      </div>

      {/* Category chips */}
      <div
        className="flex gap-2 overflow-x-auto no-scrollbar -mx-4 px-4 md:mx-0 md:px-0"
        role="group"
        aria-label="Filter by category"
      >
        {categories.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => onCategoryChange(cat)}
            aria-pressed={activeCategory === cat}
            className="chip"
          >
            {getCategoryInfo(cat)?.label ?? cat}
          </button>
        ))}
      </div>

      {/* Results counter */}
      <p className="text-sm text-ink-600" aria-live="polite">
        {loading ? 'Loading products…' : `${productCount} product${productCount !== 1 ? 's' : ''} in ${activeLabel}`}
      </p>

      {/* Loading skeletons */}
      {loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5" aria-hidden="true">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="bg-white rounded-card border border-cream-300 overflow-hidden">
              <div className="skeleton aspect-square" />
              <div className="p-4 space-y-3">
                <div className="skeleton h-5 w-3/4 rounded-md" />
                <div className="skeleton h-4 w-1/3 rounded-md" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Products grid */}
      {!loading && productCount > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              loading={loading}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </div>
      ) : !loading ? (
        <div className="flex flex-col items-center justify-center text-center py-14 px-6 bg-white rounded-card border border-cream-300">
          <div className="w-14 h-14 rounded-full bg-cream-200 flex items-center justify-center mb-4">
            <PackageOpen className="w-7 h-7 text-ink-600" aria-hidden="true" />
          </div>
          <h3 className="font-display text-xl font-semibold text-ink-900 mb-1">
            {searchQuery ? 'No products found' : 'No products yet'}
          </h3>
          <p className="text-sm text-ink-600 max-w-xs">
            {searchQuery
              ? 'Try a different search term or category.'
              : 'Add your first piece with the form to get started.'}
          </p>
        </div>
      ) : null}
    </div>
  );
};
