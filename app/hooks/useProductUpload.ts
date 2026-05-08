import { useState, useCallback } from 'react';
import { supabase } from '@/app/lib/supabase';
import { Category } from '../components/CategoryTabs';
import { MAX_PRODUCT_IMAGES, Product } from '../types/product';
import { isImageUrlsColumnAvailable, markImageUrlsColumnMissing } from './useProducts';

interface UploadFormData {
  name: string;
  description: string;
  category: Category;
  price: number;
}

export interface PendingImage {
  id: string;
  file: File;
  preview: string;
}

interface UseProductUploadReturn {
  formData: UploadFormData;
  images: PendingImage[];
  imagePreview: string;
  uploading: boolean;
  error: string | null;
  setFormData: (data: Partial<UploadFormData>) => void;
  addImages: (files: FileList | File[]) => void;
  removeImage: (id: string) => void;
  removeAllImages: () => void;
  reorderImage: (id: string, direction: 'left' | 'right') => void;
  uploadProduct: () => Promise<Product>;
  resetForm: () => void;
}

const initialFormData: UploadFormData = {
  name: '',
  description: '',
  category: 'keychain' as Category,
  price: 0,
};

const readFileAsDataURL = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.onerror = () => reject(new Error('Failed to read image file'));
    reader.readAsDataURL(file);
  });

export const useProductUpload = (): UseProductUploadReturn => {
  const [formData, setFormData] = useState<UploadFormData>(initialFormData);
  const [images, setImages] = useState<PendingImage[]>([]);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateFormData = useCallback((updates: Partial<UploadFormData>) => {
    setFormData((prev) => ({ ...prev, ...updates }));
  }, []);

  const addImages = useCallback(async (files: FileList | File[]) => {
    setError(null);
    const fileArr = Array.from(files);
    if (fileArr.length === 0) return;

    setImages((prev) => {
      const remaining = MAX_PRODUCT_IMAGES - prev.length;
      if (remaining <= 0) {
        setError(`You can upload at most ${MAX_PRODUCT_IMAGES} images per product.`);
        return prev;
      }
      if (fileArr.length > remaining) {
        setError(`Only ${remaining} more image${remaining === 1 ? '' : 's'} can be added (max ${MAX_PRODUCT_IMAGES}).`);
      }
      return prev;
    });

    // Generate previews for accepted files
    const accepted: PendingImage[] = [];
    for (const file of fileArr) {
      try {
        const preview = await readFileAsDataURL(file);
        accepted.push({
          id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
          file,
          preview,
        });
      } catch (err) {
        console.warn('Could not read file', file.name, err);
      }
    }

    setImages((prev) => {
      const remaining = MAX_PRODUCT_IMAGES - prev.length;
      if (remaining <= 0) return prev;
      return [...prev, ...accepted.slice(0, remaining)];
    });
  }, []);

  const removeImage = useCallback((id: string) => {
    setImages((prev) => prev.filter((img) => img.id !== id));
    setError(null);
  }, []);

  const removeAllImages = useCallback(() => {
    setImages([]);
    setError(null);
  }, []);

  const reorderImage = useCallback((id: string, direction: 'left' | 'right') => {
    setImages((prev) => {
      const idx = prev.findIndex((img) => img.id === id);
      if (idx < 0) return prev;
      const target = direction === 'left' ? idx - 1 : idx + 1;
      if (target < 0 || target >= prev.length) return prev;
      const next = [...prev];
      [next[idx], next[target]] = [next[target], next[idx]];
      return next;
    });
  }, []);

  const validateForm = (): boolean => {
    if (!formData.name.trim()) {
      setError('Product name is required');
      return false;
    }
    if (!formData.description.trim()) {
      setError('Product description is required');
      return false;
    }
    if (images.length === 0) {
      setError('At least one product image is required');
      return false;
    }
    if (formData.price <= 0) {
      setError('Product price must be greater than 0');
      return false;
    }
    return true;
  };

  const uploadProduct = useCallback(async (): Promise<Product> => {
    if (!validateForm()) {
      throw new Error(error || 'Form validation failed');
    }

    setUploading(true);
    setError(null);

    try {
      // Upload all images sequentially so we keep their ordering deterministic
      const uploadedUrls: string[] = [];
      for (let i = 0; i < images.length; i++) {
        const { file } = images[i];
        const timestamp = Date.now();
        const filename = `${timestamp}-${i}-${file.name}`;
        const filePath = `products/${formData.category}/${filename}`;

        const { error: uploadError } = await supabase.storage
          .from('products')
          .upload(filePath, file);

        if (uploadError) throw uploadError;

        const { data: urlData } = supabase.storage
          .from('products')
          .getPublicUrl(filePath);

        uploadedUrls.push(urlData.publicUrl);
      }

      const basePayload = {
        name: formData.name.trim(),
        description: formData.description.trim(),
        category: formData.category,
        image_url: uploadedUrls[0],
        price: formData.price,
      };
      const payload: any = isImageUrlsColumnAvailable()
        ? { ...basePayload, image_urls: uploadedUrls }
        : basePayload;

      let { data, error: insertError } = await supabase
        .from('products')
        .insert(payload)
        .select()
        .single();

      if (insertError && (insertError as any).code === '42703' && payload.image_urls) {
        markImageUrlsColumnMissing();
        const retry = await supabase
          .from('products')
          .insert(basePayload)
          .select()
          .single();
        data = retry.data;
        insertError = retry.error;
      }

      if (insertError) throw insertError;

      resetForm();
      return data as Product;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to upload product';
      setError(message);
      console.error('Error uploading product:', err);
      throw err;
    } finally {
      setUploading(false);
    }
  }, [formData, images, error]);

  const resetForm = useCallback(() => {
    setFormData(initialFormData);
    setImages([]);
    setError(null);
  }, []);

  return {
    formData,
    images,
    imagePreview: images[0]?.preview ?? '',
    uploading,
    error,
    setFormData: updateFormData,
    addImages,
    removeImage,
    removeAllImages,
    reorderImage,
    uploadProduct,
    resetForm,
  };
};
