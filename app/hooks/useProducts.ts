import { useState, useCallback, useRef } from 'react';
import { supabase } from '@/app/lib/supabase';
import { Product } from '../types/product';

interface UseProductsReturn {
  products: Product[];
  loading: boolean;
  error: string | null;
  loadProducts: (force?: boolean) => Promise<void>;
  deleteProduct: (id: string, imageUrl: string) => Promise<void>;
  addProduct: (product: Product) => void;
  removeProduct: (id: string) => void;
  updateProduct: (product: Product) => void;
}

// Module-level cache — survives re-renders and page navigation within the session
let cachedProducts: Product[] | null = null;
let cacheTimestamp = 0;
const CACHE_TTL_MS = 60_000; // 1 minute

export const useProducts = (): UseProductsReturn => {
  const [products, setProducts] = useState<Product[]>(cachedProducts ?? []);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Prevent duplicate in-flight requests
  const fetchingRef = useRef(false);

  const loadProducts = useCallback(async (force = false) => {
    const now = Date.now();
    const cacheValid = cachedProducts && (now - cacheTimestamp) < CACHE_TTL_MS;

    // Use cache if fresh and not forced
    if (!force && cacheValid) {
      setProducts(cachedProducts!);
      return;
    }

    // Deduplicate concurrent calls
    if (fetchingRef.current) return;
    fetchingRef.current = true;

    try {
      setLoading(true);
      setError(null);

      const { data, error: queryError } = await supabase
        .from('products')
        // Only fetch the fields the store page actually needs — smaller payload
        .select('id, name, description, price, image_url, category, created_at')
        .order('created_at', { ascending: false });

      if (queryError) throw queryError;

      const result = (data as Product[]) || [];
      cachedProducts = result;
      cacheTimestamp = Date.now();
      setProducts(result);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to load products';
      setError(message);
      console.error('Error loading products:', err);
    } finally {
      setLoading(false);
      fetchingRef.current = false;
    }
  }, []);

  const deleteProduct = useCallback(async (id: string, imageUrl: string) => {
    try {
      setLoading(true);
      setError(null);

      try {
        const filePath = imageUrl.split('/storage/v1/object/public/products/')[1];
        if (filePath) {
          await supabase.storage.from('products').remove([decodeURIComponent(filePath)]);
        }
      } catch (err) {
        console.warn('Could not delete image:', err);
      }

      const { error: deleteError } = await supabase.from('products').delete().eq('id', id);
      if (deleteError) throw deleteError;

      setProducts(prev => {
        const updated = prev.filter(p => p.id !== id);
        cachedProducts = updated; // keep cache in sync
        return updated;
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to delete product';
      setError(message);
      console.error('Error deleting product:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const addProduct = useCallback((product: Product) => {
    setProducts(prev => {
      const updated = [product, ...prev];
      cachedProducts = updated;
      return updated;
    });
  }, []);

  const removeProduct = useCallback((id: string) => {
    setProducts(prev => {
      const updated = prev.filter(p => p.id !== id);
      cachedProducts = updated;
      return updated;
    });
  }, []);

  const updateProduct = useCallback((product: Product) => {
    setProducts(prev => {
      const updated = prev.map(p => p.id === product.id ? product : p);
      cachedProducts = updated;
      return updated;
    });
  }, []);

  return {
    products, loading, error,
    loadProducts, deleteProduct, addProduct, removeProduct, updateProduct,
  };
};