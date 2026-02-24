'use client';

import { useState, useEffect } from 'react';
import { useProducts } from '@/app/hooks/useProducts';
import { categoryColors, categoryEmojis, CategoryColor } from '../categoryConfig';

interface UseProductDetailsReturn {
  product: any | null;
  color: CategoryColor;
  emoji: string;
  loading: boolean;
  error: string | null;
  isMessageSent: boolean;
  handleMessageOrder: () => void;
}

export const useProductDetails = (productId: string): UseProductDetailsReturn => {
  const [product, setProduct] = useState<any>(null);
  const [color, setColor] = useState<CategoryColor>(categoryColors.necklace);
  const [emoji, setEmoji] = useState('✨');
  const [isMessageSent, setIsMessageSent] = useState(false);

  const { products, loading, error, loadProducts } = useProducts();

  useEffect(() => { loadProducts(); }, [loadProducts]);

  useEffect(() => {
    if (products.length > 0) {
      const found = products.find((p) => p.id === productId);
      if (found) {
        setProduct(found);
        setColor(categoryColors[found.category] || categoryColors.necklace);
        setEmoji(categoryEmojis[found.category] || '✨');
      }
    }
  }, [products, productId]);

  const handleMessageOrder = () => {
    if (!product) return;

    const msg = `Hi! I'm interested in ordering the "${product.name}" (₱${product.price}).\n\n📸 Image: ${product.image_url}\n\nCould you please provide more details about customization options and delivery time? Thank you!`;
    const encoded = encodeURIComponent(msg);
    const appLink = `https://m.me/696684716864112?text=${encoded}`;
    const webLink = 'https://m.me/696684716864112';
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

    if (isMobile) {
      window.location.href = appLink;
      setTimeout(() => window.open(webLink, '_blank'), 500);
    } else {
      window.open(webLink, '_blank');
    }

    setIsMessageSent(true);
    setTimeout(() => setIsMessageSent(false), 2000);
  };

  return { product, color, emoji, loading, error, isMessageSent, handleMessageOrder };
};