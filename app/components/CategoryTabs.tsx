import React, { FC } from 'react';

// Type Definitions
interface Product {
  id: number;
  name: string;
  price: string;
  image: string;
}

interface ProductsByCategory {
  [key: string]: Product[];
}

export type Category = 'necklace' | 'bracelet / anklet' | 'keychain' | 'magnet';

interface CategoryTabsProps {
  categories: Category[];
  active: Category;
  onChange: (category: Category) => void;
}

// Bead-inspired icons for each category
const categoryIcons: Record<Category, string> = {
  necklace: '✨',
  'bracelet / anklet': '🌀',
  keychain: '🔑',
  magnet: '🧲',
};

const categoryColors: Record<Category, string> = {
  necklace: 'from-purple-400 to-pink-300',
  'bracelet / anklet': 'from-blue-400 to-cyan-300',
  keychain: 'from-amber-400 to-orange-300',
  magnet: 'from-green-400 to-emerald-300',
};

const CategoryTabs: FC<CategoryTabsProps> = ({ categories, active, onChange }) => {
  return (
    <div className="w-full px-4 ">
      {/* Scroll container for mobile */}
      <div className="overflow-x-auto scrollbar-hide">
        <div className="flex ml-2 gap-3 pb-4 md:pb-0 min-w-min md:min-w-full md:flex-wrap md:justify-center">
          {categories.map((category) => {
            const isActive = active === category;
            const colorGradient = categoryColors[category];
            
            return (
              <button
                key={category}
                onClick={() => onChange(category)}
                className={`
                  relative group whitespace-nowrap
                  px-4 md:px-6 py-3 md:py-4
                  rounded-full font-semibold text-sm md:text-base
                  transition-all duration-300 ease-out
                  flex items-center gap-2
                  ${
                    isActive
                      ? `bg-gradient-to-r ${colorGradient} text-white shadow-lg shadow-purple-200 scale-105`
                      : 'bg-white text-gray-700 border-2 border-gray-200 hover:border-gray-300'
                  }
                `}
              >
                {/* Bead outer glow on active */}
                {isActive && (
                  <div className="absolute inset-0 rounded-full bg-gradient-to-r from-transparent to-white opacity-20 blur-sm" />
                )}

                {/* Icon */}
                <span className={`text-lg transition-transform duration-300 ${
                  isActive ? 'animate-pulse scale-110' : 'group-hover:scale-110'
                }`}>
                  {categoryIcons[category]}
                </span>

                {/* Label */}
                <span className="capitalize relative z-10">
                  {category}
                </span>

                {/* Bottom shine effect on active */}
                {isActive && (
                  <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-3/4 h-1 bg-gradient-to-r from-transparent via-white to-transparent rounded-full opacity-40" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Hide scrollbar CSS */}
      <style>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
};

export default CategoryTabs;