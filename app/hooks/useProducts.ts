import { useState, useCallback } from 'react';
import { supabase } from '@/app/lib/supabase';
import { Product } from '../types/product';


interface UseProductsReturn {
  products: Product[];
  loading: boolean;
  error: string | null;
  loadProducts: () => Promise<void>;
  deleteProduct: (id: string, imageUrl: string) => Promise<void>;
  addProduct: (product: Product) => void;
  removeProduct: (id: string) => void;
}

export const useProducts = (): UseProductsReturn => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadProducts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const { data, error: queryError } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

      if (queryError) throw queryError;
      setProducts(data || []);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to load products';
      setError(message);
      console.error('Error loading products:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteProduct = useCallback(async (id: string, imageUrl: string) => {
    try {
      setLoading(true);
      setError(null);

      // Delete image from storage
      try {
        const filePath = imageUrl.split('/storage/v1/object/public/products/')[1];
        if (filePath) {
          await supabase.storage.from('products').remove([filePath]);
        }
      } catch (err) {
        console.warn('Could not delete image:', err);
      }

      // Delete from database
      const { error: deleteError } = await supabase
        .from('products')
        .delete()
        .eq('id', id);

      if (deleteError) throw deleteError;

      setProducts((prev) => prev.filter((p) => p.id !== id));
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
    setProducts((prev) => [product, ...prev]);
  }, []);

  const removeProduct = useCallback((id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
  }, []);

  return {
    products,
    loading,
    error,
    loadProducts,
    deleteProduct,
    addProduct,
    removeProduct,
  };
};