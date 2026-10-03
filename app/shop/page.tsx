import { Suspense } from 'react';
import type { Metadata } from 'next';
import ShopPage from './ShopPage';

export const metadata: Metadata = {
  title: 'Shop - Dangling Co.',
  description: 'Handmade beaded keychains, necklaces, bracelets and magnets, made to order.',
};

export default function Page() {
  // useSearchParams (category filter) needs a Suspense boundary for static rendering.
  return (
    <Suspense>
      <ShopPage />
    </Suspense>
  );
}
