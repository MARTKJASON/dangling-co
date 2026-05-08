'use client';

import { useState, useCallback } from 'react';
import { supabase } from '@/app/lib/supabase';
import { Category } from '../components/CategoryTabs';
import { getProductImages, MAX_PRODUCT_IMAGES, Product } from '../types/product';
import { isImageUrlsColumnAvailable, markImageUrlsColumnMissing } from './useProducts';

interface EditFormData {
  name: string;
  description: string;
  category: Category;
  price: number;
}

export type EditImageSlot =
  | { id: string; kind: 'existing'; url: string }
  | { id: string; kind: 'pending'; file: File; preview: string };

interface UseProductEditReturn {
  editingProduct: Product | null;
  editFormData: EditFormData;
  imageSlots: EditImageSlot[];
  updating: boolean;
  error: string | null;
  openEdit: (product: Product) => void;
  closeEdit: () => void;
  setEditFormData: (data: Partial<EditFormData>) => void;
  addImages: (files: FileList | File[]) => void;
  replaceImage: (id: string, file: File) => void;
  removeImage: (id: string) => void;
  reorderImage: (id: string, direction: 'left' | 'right') => void;
  updateProduct: () => Promise<Product>;
}

const newId = () => `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

const readFileAsDataURL = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.onerror = () => reject(new Error('Failed to read image file'));
    reader.readAsDataURL(file);
  });

const extractStoragePath = (url: string): string | null => {
  const part = url.split('/storage/v1/object/public/products/')[1];
  if (!part) return null;
  try {
    return decodeURIComponent(part);
  } catch {
    return part;
  }
};

export const useProductEdit = (): UseProductEditReturn => {
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [editFormData, setEditFormDataState] = useState<EditFormData>({
    name: '',
    description: '',
    category: 'keychain',
    price: 0,
  });
  const [imageSlots, setImageSlots] = useState<EditImageSlot[]>([]);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const openEdit = useCallback((product: Product) => {
    setEditingProduct(product);
    setEditFormDataState({
      name: product.name,
      description: product.description,
      category: product.category as Category,
      price: parseFloat(product.price as any) || 0,
    });
    const initialUrls = getProductImages(product);
    setImageSlots(initialUrls.map((url) => ({ id: newId(), kind: 'existing', url })));
    setError(null);
  }, []);

  const closeEdit = useCallback(() => {
    setEditingProduct(null);
    setImageSlots([]);
    setError(null);
  }, []);

  const setEditFormData = useCallback((data: Partial<EditFormData>) => {
    setEditFormDataState((prev) => ({ ...prev, ...data }));
  }, []);

  const addImages = useCallback(async (files: FileList | File[]) => {
    setError(null);
    const fileArr = Array.from(files);
    if (fileArr.length === 0) return;

    let remaining = 0;
    setImageSlots((prev) => {
      remaining = MAX_PRODUCT_IMAGES - prev.length;
      if (remaining <= 0) {
        setError(`You can have at most ${MAX_PRODUCT_IMAGES} images per product.`);
      } else if (fileArr.length > remaining) {
        setError(`Only ${remaining} more image${remaining === 1 ? '' : 's'} can be added (max ${MAX_PRODUCT_IMAGES}).`);
      }
      return prev;
    });

    if (remaining <= 0) return;

    const accepted: EditImageSlot[] = [];
    for (const file of fileArr.slice(0, remaining)) {
      try {
        const preview = await readFileAsDataURL(file);
        accepted.push({ id: newId(), kind: 'pending', file, preview });
      } catch (err) {
        console.warn('Could not read file', file.name, err);
      }
    }

    setImageSlots((prev) => {
      const space = MAX_PRODUCT_IMAGES - prev.length;
      if (space <= 0) return prev;
      return [...prev, ...accepted.slice(0, space)];
    });
  }, []);

  const replaceImage = useCallback(async (id: string, file: File) => {
    setError(null);
    try {
      const preview = await readFileAsDataURL(file);
      setImageSlots((prev) =>
        prev.map((slot) => (slot.id === id ? { id, kind: 'pending', file, preview } : slot)),
      );
    } catch {
      setError('Failed to read image file');
    }
  }, []);

  const removeImage = useCallback((id: string) => {
    setImageSlots((prev) => prev.filter((slot) => slot.id !== id));
    setError(null);
  }, []);

  const reorderImage = useCallback((id: string, direction: 'left' | 'right') => {
    setImageSlots((prev) => {
      const idx = prev.findIndex((slot) => slot.id === id);
      if (idx < 0) return prev;
      const target = direction === 'left' ? idx - 1 : idx + 1;
      if (target < 0 || target >= prev.length) return prev;
      const next = [...prev];
      [next[idx], next[target]] = [next[target], next[idx]];
      return next;
    });
  }, []);

  const validateForm = (formData: EditFormData): boolean => {
    if (!formData.name.trim()) {
      setError('Product name is required');
      return false;
    }
    if (!formData.description.trim()) {
      setError('Product description is required');
      return false;
    }
    if (formData.price <= 0) {
      setError('Product price must be greater than 0');
      return false;
    }
    if (imageSlots.length === 0) {
      setError('At least one product image is required');
      return false;
    }
    return true;
  };

  const updateProduct = useCallback(async (): Promise<Product> => {
    if (!editingProduct) throw new Error('No product selected for editing');
    if (!validateForm(editFormData)) throw new Error('Form validation failed');

    setUpdating(true);
    setError(null);

    try {
      // Upload pending files in slot order so the final URL order matches the UI
      const finalUrls: string[] = [];
      for (let i = 0; i < imageSlots.length; i++) {
        const slot = imageSlots[i];
        if (slot.kind === 'existing') {
          finalUrls.push(slot.url);
          continue;
        }
        const timestamp = Date.now();
        const filename = `${timestamp}-${i}-${slot.file.name}`;
        const filePath = `products/${editFormData.category}/${filename}`;

        const { error: uploadError } = await supabase.storage
          .from('products')
          .upload(filePath, slot.file);

        if (uploadError) throw uploadError;

        const { data: urlData } = supabase.storage.from('products').getPublicUrl(filePath);
        finalUrls.push(urlData.publicUrl);
      }

      // Identify orphaned URLs (present originally but not in the final list) and remove them
      const originalUrls = getProductImages(editingProduct);
      const finalSet = new Set(finalUrls);
      const removedPaths = originalUrls
        .filter((url) => !finalSet.has(url))
        .map(extractStoragePath)
        .filter((p): p is string => Boolean(p));

      if (removedPaths.length > 0) {
        try {
          await supabase.storage.from('products').remove(removedPaths);
        } catch {
          console.warn('Could not delete one or more old product images from storage');
        }
      }

      const basePayload = {
        name: editFormData.name.trim(),
        description: editFormData.description.trim(),
        category: editFormData.category,
        price: editFormData.price,
        image_url: finalUrls[0],
      };
      const payload: any = isImageUrlsColumnAvailable()
        ? { ...basePayload, image_urls: finalUrls }
        : basePayload;

      let { data, error: updateError } = await supabase
        .from('products')
        .update(payload)
        .eq('id', editingProduct.id)
        .select()
        .single();

      if (updateError && (updateError as any).code === '42703' && payload.image_urls) {
        markImageUrlsColumnMissing();
        const retry = await supabase
          .from('products')
          .update(basePayload)
          .eq('id', editingProduct.id)
          .select()
          .single();
        data = retry.data;
        updateError = retry.error;
      }

      if (updateError) throw updateError;

      return data as Product;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to update product';
      setError(message);
      console.error('Error updating product:', err);
      throw err;
    } finally {
      setUpdating(false);
    }
  }, [editingProduct, editFormData, imageSlots]);

  return {
    editingProduct,
    editFormData,
    imageSlots,
    updating,
    error,
    openEdit,
    closeEdit,
    setEditFormData,
    addImages,
    replaceImage,
    removeImage,
    reorderImage,
    updateProduct,
  };
};
