'use client';

import { useEffect, useMemo, useState } from 'react';
import { useProducts } from '@/app/hooks/useProducts';
import { Product } from '@/app/types/product';

interface UseProductDetailsReturn {
  product: Product | null;
  /** Up to four other products, same category first. */
  related: Product[];
  loading: boolean;
  error: string | null;
  /** True once products have loaded and this id wasn't among them. */
  notFound: boolean;
  retry: () => void;
}

export const useProductDetails = (productId: string): UseProductDetailsReturn => {
  const { products, loading, error, loadProducts } = useProducts();
  const [settled, setSettled] = useState(products.length > 0);

  useEffect(() => {
    loadProducts().finally(() => setSettled(true));
  }, [loadProducts]);

  const product = useMemo(() => products.find((p) => p.id === productId) ?? null, [products, productId]);

  const related = useMemo(() => {
    if (!product) return [];
    const others = products.filter((p) => p.id !== product.id);
    const same = others.filter((p) => p.category === product.category);
    const rest = others.filter((p) => p.category !== product.category);
    return [...same, ...rest].slice(0, 4);
  }, [products, product]);

  return {
    product,
    related,
    loading: loading || !settled,
    error,
    notFound: settled && !loading && !error && !product,
    retry: () => loadProducts(true),
  };
};
