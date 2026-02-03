import { useState, useMemo, useCallback } from 'react';
import { Category } from '../components/CategoryTabs';
import { Product } from '../types/product';


interface UseProductFilterReturn {
  searchQuery: string;
  activeCategory: Category;
  filteredProducts: Product[];
  setSearchQuery: (query: string) => void;
  setActiveCategory: (category: Category) => void;
}

export const useProductFilter = (
  products: Product[],
  initialCategory: Category = 'keychain'
): UseProductFilterReturn => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<Category>(initialCategory);

  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => p.category === activeCategory)
      .filter((p) => {
        const query = searchQuery.toLowerCase();
        return (
          p.name.toLowerCase().includes(query) ||
          p.description.toLowerCase().includes(query)
        );
      });
  }, [products, activeCategory, searchQuery]);

  return {
    searchQuery,
    activeCategory,
    filteredProducts,
    setSearchQuery,
    setActiveCategory,
  };
};