import { useState, useCallback } from 'react';
import { supabase } from '@/app/lib/supabase';
import { Category } from '../components/CategoryTabs';
import { Product } from '../types/product';


interface UploadFormData {
  name: string;
  description: string;
  category: Category;
  price: number; 
}

interface UseProductUploadReturn {
  formData: UploadFormData;
  imageFile: File | null;
  imagePreview: string;
  uploading: boolean;
  error: string | null;
  setFormData: (data: Partial<UploadFormData>) => void;
  handleImageChange: (file: File) => void;
  removeImage: () => void;
  uploadProduct: () => Promise<Product>;
  resetForm: () => void;
}

const initialFormData: UploadFormData = {
  name: '',
  description: '',
  category: 'keychain' as Category,
  price: 0, 
};

export const useProductUpload = (): UseProductUploadReturn => {
  const [formData, setFormData] = useState<UploadFormData>(initialFormData);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateFormData = useCallback((updates: Partial<UploadFormData>) => {
    setFormData((prev) => ({
      ...prev,
      ...updates,
    }));
  }, []);

  const handleImageChange = useCallback((file: File) => {
    setImageFile(file);
    setError(null);

    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.onerror = () => {
      setError('Failed to read image file');
    };
    reader.readAsDataURL(file);
  }, []);

  const removeImage = useCallback(() => {
    setImagePreview('');
    setImageFile(null);
    setError(null);
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
    if (!imageFile) {
      setError('Product image is required');
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
      // Upload image to storage
      const timestamp = Date.now();
      const filename = `${timestamp}-${imageFile!.name}`;
      const filePath = `products/${formData.category}/${filename}`;

      const { error: uploadError } = await supabase.storage
        .from('products')
        .upload(filePath, imageFile!);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: urlData } = supabase.storage
        .from('products')
        .getPublicUrl(filePath);

      const imageUrl = urlData.publicUrl;

      // Save to database
      const { data, error: insertError } = await supabase
        .from('products')
        .insert({
          name: formData.name.trim(),
          description: formData.description.trim(),
          category: formData.category,
          image_url: imageUrl,
          price: formData.price,
        })
        .select()
        .single();

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
  }, [formData, imageFile, error]);

  const resetForm = useCallback(() => {
    setFormData(initialFormData);
    setImageFile(null);
    setImagePreview('');
    setError(null);
  }, []);

  return {
    formData,
    imageFile,
    imagePreview,
    uploading,
    error,
    setFormData: updateFormData,
    handleImageChange,
    removeImage,
    uploadProduct,
    resetForm,
  };
};