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

// Tracks whether the optional image_urls column exists. Set to false on the
// first 42703 (undefined column) error so subsequent queries skip it.
let imageUrlsColumnAvailable = true;
export const isImageUrlsColumnAvailable = () => imageUrlsColumnAvailable;
export const markImageUrlsColumnMissing = () => { imageUrlsColumnAvailable = false; };

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

      const fetchWithImageUrls = () =>
        supabase
          .from('products')
          .select('id, name, description, price, image_url, image_urls, category, created_at')
          .order('created_at', { ascending: false });

      const fetchWithoutImageUrls = () =>
        supabase
          .from('products')
          .select('id, name, description, price, image_url, category, created_at')
          .order('created_at', { ascending: false });

      let data: any = null;
      let queryError: any = null;

      if (imageUrlsColumnAvailable) {
        const res = await fetchWithImageUrls();
        data = res.data;
        queryError = res.error;
        if (queryError && queryError.code === '42703') {
          imageUrlsColumnAvailable = false;
          const retry = await fetchWithoutImageUrls();
          data = retry.data;
          queryError = retry.error;
        }
      } else {
        const res = await fetchWithoutImageUrls();
        data = res.data;
        queryError = res.error;
      }

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
        const target = cachedProducts?.find(p => p.id === id);
        const urls = new Set<string>();
        if (imageUrl) urls.add(imageUrl);
        target?.image_urls?.forEach(u => { if (u) urls.add(u); });

        const paths = Array.from(urls)
          .map(u => u.split('/storage/v1/object/public/products/')[1])
          .filter((p): p is string => Boolean(p))
          .map(decodeURIComponent);

        if (paths.length > 0) {
          await supabase.storage.from('products').remove(paths);
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