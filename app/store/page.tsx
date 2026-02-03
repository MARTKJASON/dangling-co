'use client';

import React, { useState, FC, useRef, useEffect } from 'react';
import { Sparkles, Search, ChevronLeft, ChevronRight } from 'lucide-react';
import CategoryTabs, { Category } from '../components/CategoryTabs';
import ProductCard from '../components/ProductCard';
import { useRouter } from 'next/navigation';
import { useProducts } from '../hooks/useProducts';

interface StorePageProps {
  onCustomizeClick: () => void;
}

const StorePage: FC<StorePageProps> = ({ onCustomizeClick }) => {
  const categories: Category[] = ['keychain', 'necklace', 'bracelet', 'anklet', 'magnet'];
  const [activeCategory, setActiveCategory] = useState<Category>('keychain');
  const [searchQuery, setSearchQuery] = useState('');
  const [isAnimating, setIsAnimating] = useState(false);
  const [showSwipeHint, setShowSwipeHint] = useState(true);
  
  // Load products from Supabase
  const { products, loading, error, loadProducts } = useProducts();
  
  // Swipe detection refs
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  // Load products on component mount
  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  // Hide swipe hint after first interaction
  useEffect(() => {
    const timer = setTimeout(() => setShowSwipeHint(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  const handleCategoryChange = (category: Category): void => {
    setActiveCategory(category);
  };

  // Swipe handlers for product grid
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.changedTouches[0].screenX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    touchEndX.current = e.changedTouches[0].screenX;
    setShowSwipeHint(false); // Hide hint on first swipe
    handleSwipe();
  };

  const handleSwipe = () => {
    const swipeThreshold = 50; // Minimum distance to trigger swipe
    const diff = touchStartX.current - touchEndX.current;

    // Prevent rapid consecutive swipes
    if (isAnimating) return;

    const currentIndex = categories.indexOf(activeCategory);

    // Swiped left (next category)
    if (diff > swipeThreshold && currentIndex < categories.length - 1) {
      setIsAnimating(true);
      handleCategoryChange(categories[currentIndex + 1]);
      setTimeout(() => setIsAnimating(false), 300);
    }

    // Swiped right (previous category)
    if (diff < -swipeThreshold && currentIndex > 0) {
      setIsAnimating(true);
      handleCategoryChange(categories[currentIndex - 1]);
      setTimeout(() => setIsAnimating(false), 300);
    }
  };
  const router = useRouter();

  const handleOnCustomizeClick = () => {
    router.push('/customize');
  };

  // Filter products based on active category and search query
  const filteredProducts = products.filter((product) => {
    const matchesCategory = product.category === activeCategory;
    const matchesSearch = searchQuery.toLowerCase() === '' || 
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (product.description && product.description.toLowerCase().includes(searchQuery.toLowerCase()));
    
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-purple-50 to-pink-50 ">
      {/* Header */}
      <div className="sticky top-0 z-40 backdrop-blur-xl bg-white/80 border-b border-purple-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-4 md:py-6">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 md:gap-6">
            {/* Title Section */}
            <div className="w-full md:w-auto">
              <div className="flex items-center gap-3 mb-2">
                <div className="flex gap-1">
                  <div className="w-3 h-3 rounded-full bg-gradient-to-br from-purple-400 to-pink-300 shadow-md" />
                  <div className="w-3 h-3 rounded-full bg-gradient-to-br from-blue-400 to-cyan-300 shadow-md" />
                  <div className="w-3 h-3 rounded-full bg-gradient-to-br from-amber-400 to-orange-300 shadow-md" />
                </div>
                <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-purple-600 via-pink-500 to-orange-400 bg-clip-text text-transparent">
                  Our Collection
                </h1>
              </div>
              <p className="text-sm md:text-base text-gray-600 ml-6">
                Handcrafted beaded jewelry for every moment
              </p>
            </div>

            {/* Customize Button */}
            <button
              onClick={handleOnCustomizeClick}
              className="group relative w-full md:w-auto flex items-center justify-center gap-2 px-6 md:px-8 py-3 md:py-3 bg-gradient-to-r from-purple-500 via-pink-500 to-orange-400 hover:from-purple-600 hover:via-pink-600 hover:to-orange-500 text-white font-semibold rounded-full transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 whitespace-nowrap"
            >
              <Sparkles className="w-5 h-5 animate-spin" style={{ animationDuration: '3s' }} />
              <span>Create Your Own</span>
              <div className="absolute inset-0 rounded-full bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-300" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-8 md:py-12">
        {/* Search Bar */}
        <div className="mb-10 md:mb-12">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search for your favorite beads..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 md:py-4 bg-white border-2 border-purple-200 rounded-full focus:outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-200 text-gray-700 placeholder-gray-400 transition-all duration-300 shadow-sm"
            />
          </div>
        </div>

        {/* Category Tabs */}
        <div className="mb-10 flex justify-center ">
          <div className="w-full ">
            <CategoryTabs
              categories={categories}
              active={activeCategory}
              onChange={handleCategoryChange}
            />
          </div>
        </div>

        {/* Products Section */}
        <div
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          className="select-none relative"
        >
          {/* Swipe Hint Indicator */}
          {showSwipeHint && (
            <div className="absolute  mt-10 left-1/2 transform -translate-x-1/2 z-10 flex items-center gap-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-full text-[10px] font-semibold shadow-lg animate-bounce md:hidden">
              <ChevronLeft className="w-4 h-4" />
              <span>Swipe to change</span>
              <ChevronRight className="w-5 h-4" />
            </div>
          )}
          {/* Category Title with Bead Decoration */}
          <div className="flex items-center gap-3 mb-8 md:mb-10">
            <div className={`w-4 h-4 rounded-full bg-gradient-to-br ${
              activeCategory === 'necklace' ? 'from-purple-400 to-pink-300' :
              activeCategory === 'bracelet' ? 'from-blue-400 to-cyan-300' :
              activeCategory === 'keychain' ? 'from-amber-400 to-orange-300' :
              activeCategory === 'anklet' ? 'from-rose-400 to-red-300' :
              'from-green-400 to-emerald-300'
            } shadow-md`} />
            <h2 className={`text-xl md:text-2xl font-bold text-gray-800 capitalize transition-all duration-300 ${isAnimating ? 'opacity-50' : 'opacity-100'}`}>
              {activeCategory}s
            </h2>
            <div className={`h-1 flex-grow bg-gradient-to-r ${
              activeCategory === 'necklace' ? 'from-purple-200 to-transparent' :
              activeCategory === 'bracelet' ? 'from-blue-200 to-transparent' :
              activeCategory === 'keychain' ? 'from-amber-200 to-transparent' :
              activeCategory === 'anklet' ? 'from-rose-200 to-transparent' :
              'from-green-200 to-transparent'
            } rounded-full`} />
          </div>

          {/* Loading State */}
          {loading && (
            <div className="flex flex-col items-center justify-center py-16 md:py-20">
              <div className="text-5xl mb-4 animate-bounce">✨</div>
              <h3 className="text-lg md:text-xl font-semibold text-gray-800 mb-2">
                Loading beads...
              </h3>
              <p className="text-gray-600 text-center max-w-sm">
                Getting our collection ready for you
              </p>
            </div>
          )}

          {/* Error State */}
          {error && !loading && (
            <div className="flex flex-col items-center justify-center py-16 md:py-20">
              <div className="text-5xl mb-4">⚠️</div>
              <h3 className="text-lg md:text-xl font-semibold text-gray-800 mb-2">
                Something went wrong
              </h3>
              <p className="text-gray-600 text-center max-w-sm mb-4">
                {error}
              </p>
              <button
                onClick={() => loadProducts()}
                className="px-4 py-2 bg-purple-500 text-white rounded-full hover:bg-purple-600 transition-colors"
              >
                Try Again
              </button>
            </div>
          )}

          {/* Products Grid */}
          {!loading && !error && filteredProducts.length > 0 ? (
            <div className={`grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 lg:gap-8 transition-all duration-300 ${isAnimating ? 'opacity-50' : 'opacity-100'}`}>
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : !loading && !error && (
            <div className="flex flex-col items-center justify-center py-16 md:py-20">
              <div className="text-5xl mb-4">🔍</div>
              <h3 className="text-lg md:text-xl font-semibold text-gray-800 mb-2">
                No beads found
              </h3>
              <p className="text-gray-600 text-center max-w-sm">
                Try searching for something different or explore another category
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Decorative Beads Footer */}
      <div className="mt-16 md:mt-20 py-8 md:py-12 border-t border-purple-100">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="flex justify-center gap-6 md:gap-8 flex-wrap">
            {['✨', '🌀', '🔑', '💫', '🧲'].map((bead, i) => (
              <div key={i} className="text-3xl md:text-4xl animate-bounce" style={{ animationDelay: `${i * 0.1}s` }}>
                {bead}
              </div>
            ))}
          </div>
          <p className="text-center text-gray-600 mt-6 text-sm md:text-base">
            Each piece is handcrafted with love ✨
          </p>
        </div>
      </div>
    </div>
  );
};

export default StorePage;