'use client';

import { useState, useCallback } from 'react';
import { supabase } from '@/app/lib/supabase';
import { Category } from '../components/CategoryTabs';
import { Product } from '../types/product';

interface EditFormData {
  name: string;
  description: string;
  category: Category;
  price: number;
}

interface UseProductEditReturn {
  editingProduct: Product | null;
  editFormData: EditFormData;
  imageFile: File | null;
  imagePreview: string | null;
  updating: boolean;
  error: string | null;
  openEdit: (product: Product) => void;
  closeEdit: () => void;
  setEditFormData: (data: Partial<EditFormData>) => void;
  handleImageChange: (file: File) => void;
  removeImage: () => void;
  updateProduct: () => Promise<Product>;
}

export const useProductEdit = (): UseProductEditReturn => {
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [editFormData, setEditFormDataState] = useState<EditFormData>({
    name: '',
    description: '',
    category: 'keychain',
    price: 0,
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /** Open edit modal and pre-fill form with selected product's data */
  const openEdit = useCallback((product: Product) => {
    setEditingProduct(product);
    setEditFormDataState({
      name: product.name,
      description: product.description,
      category: product.category as Category,
      price: parseFloat(product.price as any) || 0,
    });
    setImageFile(null);
    setImagePreview(null);
    setError(null);
  }, []);

  /** Close modal and reset all edit state */
  const closeEdit = useCallback(() => {
    setEditingProduct(null);
    setImageFile(null);
    setImagePreview(null);
    setError(null);
  }, []);

  /** Partial updater for form fields */
  const setEditFormData = useCallback((data: Partial<EditFormData>) => {
    setEditFormDataState((prev) => ({ ...prev, ...data }));
  }, []);

  /** Preview a newly selected image locally */
  const handleImageChange = useCallback((file: File) => {
    setImageFile(file);
    setError(null);
    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result as string);
    reader.onerror = () => setError('Failed to read image file');
    reader.readAsDataURL(file);
  }, []);

  /** Discard new image selection — reverts back to the product's original image */
  const removeImage = useCallback(() => {
    setImageFile(null);
    setImagePreview(null);
  }, []);

  /** Validate form fields before submitting */
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
    return true;
  };

  /**
   * Persist changes to Supabase.
   *
   * - If a new image was selected, uploads it to the same bucket/path structure
   *   as useProductUpload (`products/{category}/{timestamp}-{filename}`), then
   *   attempts to delete the old image from storage.
   * - Updates the `products` table row and returns the refreshed Product.
   */
  const updateProduct = useCallback(async (): Promise<Product> => {
    if (!editingProduct) throw new Error('No product selected for editing');
    if (!validateForm(editFormData)) throw new Error('Form validation failed');

    setUpdating(true);
    setError(null);

    try {
      let imageUrl = editingProduct.image_url;

      // ── Upload new image if one was selected ────────────────────────────
      if (imageFile) {
        const timestamp = Date.now();
        const filename = `${timestamp}-${imageFile.name}`;
        const filePath = `products/${editFormData.category}/${filename}`;

        const { error: uploadError } = await supabase.storage
          .from('products')
          .upload(filePath, imageFile);

        if (uploadError) throw uploadError;

        const { data: urlData } = supabase.storage
          .from('products')
          .getPublicUrl(filePath);

        imageUrl = urlData.publicUrl;

        // Delete old image from storage (best-effort — don't block on failure)
        try {
          const oldPath = decodeURIComponent(
            editingProduct.image_url.split('/storage/v1/object/public/products/')[1] ?? '',
          );
          if (oldPath) {
            await supabase.storage.from('products').remove([oldPath]);
          }
        } catch {
          console.warn('Could not delete old product image from storage');
        }
      }
      // ───────────────────────────────────────────────────────────────────

      // ── Update the database row ─────────────────────────────────────────
      const { data, error: updateError } = await supabase
        .from('products')
        .update({
          name: editFormData.name.trim(),
          description: editFormData.description.trim(),
          category: editFormData.category,
          price: editFormData.price,
          image_url: imageUrl,
        })
        .eq('id', editingProduct.id)
        .select()
        .single();

      if (updateError) throw updateError;
      // ───────────────────────────────────────────────────────────────────

      return data as Product;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to update product';
      setError(message);
      console.error('Error updating product:', err);
      throw err;
    } finally {
      setUpdating(false);
    }
  }, [editingProduct, editFormData, imageFile]);

  return {
    editingProduct,
    editFormData,
    imageFile,
    imagePreview,
    updating,
    error,
    openEdit,
    closeEdit,
    setEditFormData,
    handleImageChange,
    removeImage,
    updateProduct,
  };
};