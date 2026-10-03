'use client';

import React, { FC, useEffect, useState } from 'react';
import ProductCard, { ProductCardSkeleton } from '../ProductCard';
import { useProducts } from '@/app/hooks/useProducts';

/** The four newest products (the products query is already ordered newest first). */
export const RecentProducts: FC = () => {
  const { products, loading, error, loadProducts } = useProducts();
  const [settled, setSettled] = useState(false);

  useEffect(() => {
    loadProducts().finally(() => setSettled(true));
  }, [loadProducts]);

  // On error or an empty shop, quietly leave the section's "Shop all" link to do the work.
  if (error || (settled && !loading && products.length === 0)) return null;

  const showSkeleton = loading || products.length === 0;

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-3 gap-y-5 sm:gap-5">
      {showSkeleton
        ? Array.from({ length: 4 }).map((_, i) => <ProductCardSkeleton key={i} />)
        : products.slice(0, 4).map((p) => <ProductCard key={p.id} product={p} />)}
    </div>
  );
};
