import React from 'react';
import { Loader, Image as ImageIcon } from 'lucide-react';
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
  onDelete,
}) => {
  const filteredProducts = products
    .filter((p) => p.category === activeCategory)
    .filter((p) =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase())
    );

  return (
    <div className="space-y-6">
      {/* Search Bar */}
      <div className="relative">
        <input
          type="text"
          placeholder="Search your products..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pl-12 pr-4 py-3 md:py-4 bg-white border-2 border-purple-200 rounded-full focus:outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-200 text-gray-700 placeholder-gray-400 transition-all duration-300 shadow-sm"
        />
        <svg
          className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </div>

      {/* Category Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => onCategoryChange(cat)}
            className={`px-4 py-2 rounded-full font-semibold whitespace-nowrap transition-all duration-300 ${
              activeCategory === cat
                ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                : 'bg-white border-2 border-purple-200 text-gray-700 hover:border-purple-500'
            }`}
          >
            {cat.charAt(0).toUpperCase() + cat.slice(1)}
          </button>
        ))}
      </div>

      {/* Products Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader className="w-8 h-8 animate-spin text-purple-500" />
        </div>
      ) : filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              loading={loading}
              onDelete={onDelete}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-16 bg-white rounded-xl border-2 border-purple-100">
          <ImageIcon className="w-16 h-16 text-purple-300 mb-4" />
          <h3 className="text-lg font-semibold text-gray-800 mb-2">No products yet</h3>
          <p className="text-gray-600 text-center max-w-sm">
            Start by uploading your first product using the form above
          </p>
        </div>
      )}
    </div>
  );
};