'use client';

import React, { useState, useMemo } from 'react';
import { Loader, Search, Filter, X } from 'lucide-react';
import { ProductCard } from './ProductCard';
import { Category } from '@/app/components/CategoryTabs';
import { Product } from '@/app/types/product';

interface ProductListProps {
  products: Product[];
  categories: Category[];
  loading: boolean;
  searchQuery: string;
  activeCategory: Category;
  onSearchChange: (query: string) => void;
  onCategoryChange: (category: Category) => void;
  onEdit: (product: Product) => void;   // ← new prop
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
  const [showMobileFilters, setShowMobileFilters] = useState(false);

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

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Search and Filter Header */}
      <div className="space-y-3 sm:space-y-4">
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
          <input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-12 pr-4 py-2.5 sm:py-3 bg-white border-2 border-purple-200 rounded-xl focus:outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-200 text-sm sm:text-base placeholder-gray-400 transition-all duration-300 shadow-sm hover:border-purple-300"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Category Filters - Desktop */}
        <div>
          <div className="hidden sm:flex gap-2 overflow-x-auto pb-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => onCategoryChange(cat)}
                className={`px-4 py-2 rounded-lg font-semibold whitespace-nowrap text-sm transition-all duration-300 ${
                  activeCategory === cat
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg scale-105'
                    : 'bg-white border-2 border-purple-200 text-gray-700 hover:border-purple-500 hover:bg-purple-50'
                }`}
              >
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </button>
            ))}
          </div>

          {/* Category Filters - Mobile */}
          <div className="sm:hidden flex items-center gap-2">
            <button
              onClick={() => setShowMobileFilters(!showMobileFilters)}
              className="flex items-center gap-2 px-4 py-2 bg-white border-2 border-purple-200 text-gray-700 font-semibold rounded-lg hover:border-purple-500 transition-all"
            >
              <Filter className="w-5 h-5" />
              <span>Filter</span>
            </button>
            <div className="text-sm text-gray-600">
              {activeCategory.charAt(0).toUpperCase() + activeCategory.slice(1)}
            </div>
          </div>

          {showMobileFilters && (
            <div className="sm:hidden grid grid-cols-2 gap-2 mt-3 animate-in fade-in slide-in-from-top-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => {
                    onCategoryChange(cat);
                    setShowMobileFilters(false);
                  }}
                  className={`px-3 py-2 rounded-lg font-semibold text-sm transition-all ${
                    activeCategory === cat
                      ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                      : 'bg-white border-2 border-purple-200 text-gray-700'
                  }`}
                >
                  {cat.charAt(0).toUpperCase() + cat.slice(1)}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Results Counter */}
        <div className="flex items-center justify-between text-xs sm:text-sm text-gray-600">
          <span>
            {loading ? 'Loading...' : `${productCount} product${productCount !== 1 ? 's' : ''}`}
          </span>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-12 sm:py-16">
          <div className="text-center">
            <Loader className="w-8 h-8 sm:w-10 sm:h-10 animate-spin text-purple-500 mx-auto mb-2" />
            <p className="text-sm text-gray-600">Loading products...</p>
          </div>
        </div>
      )}

      {/* Products Grid */}
      {!loading && productCount > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              loading={loading}
              onEdit={onEdit}       // ← pass down
              onDelete={onDelete}
            />
          ))}
        </div>
      ) : !loading ? (
        <div className="flex flex-col items-center justify-center py-12 sm:py-16 bg-white rounded-2xl border-2 border-purple-100">
          <div className="p-3 sm:p-4 bg-purple-100 rounded-full mb-4">
            <Search className="w-6 h-6 sm:w-8 sm:h-8 text-purple-600" />
          </div>
          <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-2">
            {searchQuery ? 'No products found' : 'No products yet'}
          </h3>
          <p className="text-xs sm:text-sm text-gray-600 text-center max-w-xs px-4">
            {searchQuery
              ? 'Try adjusting your search terms or filters'
              : 'Start by uploading your first product using the form above'}
          </p>
        </div>
      ) : null}
    </div>
  );
};