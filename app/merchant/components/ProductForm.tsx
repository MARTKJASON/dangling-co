'use client';

import React, { useState } from 'react';
import { Upload, Loader, ImagePlus, X, AlertCircle, ArrowLeft, ArrowRight, Star } from 'lucide-react';
import { Plus } from 'lucide-react';
import { Category } from '@/app/components/CategoryTabs';
import { MAX_PRODUCT_IMAGES } from '@/app/types/product';
import type { PendingImage } from '@/app/hooks/useProductUpload';

interface ProductFormProps {
  formData: {
    name: string;
    description: string;
    category: Category;
    price: number | string;
  };
  images: PendingImage[];
  uploading: boolean;
  error?: string | null;
  categories: Category[];
  onInputChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => void;
  onAddImages: (files: FileList) => void;
  onRemoveImage: (id: string) => void;
  onReorderImage: (id: string, direction: 'left' | 'right') => void;
  onSubmit: (e: React.FormEvent) => void;
}

export const ProductForm: React.FC<ProductFormProps> = ({
  formData,
  images,
  uploading,
  error,
  categories,
  onInputChange,
  onAddImages,
  onRemoveImage,
  onReorderImage,
  onSubmit,
}) => {
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const isFormValid =
    formData.name && formData.description && formData.category && formData.price && images.length > 0;
  const remainingSlots = Math.max(0, MAX_PRODUCT_IMAGES - images.length);
  const canAddMore = remainingSlots > 0 && !uploading;

  return (
    <div className="w-full bg-gradient-to-br from-white to-purple-50 rounded-2xl border-2 border-purple-200 p-4 sm:p-6 lg:p-8 shadow-lg hover:shadow-xl transition-shadow duration-300">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg">
          <Plus className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
        </div>
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800">Add New Product</h2>
          <p className="text-xs sm:text-sm text-gray-600">Fill in the details below</p>
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-lg flex gap-3 animate-in fade-in slide-in-from-top">
          <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-red-700">Error</p>
            <p className="text-sm text-red-600">{error}</p>
          </div>
        </div>
      )}

      <form onSubmit={onSubmit} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column - Form Inputs */}
          <div className="space-y-5">
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">Product Name *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={onInputChange}
                onFocus={() => setFocusedField('name')}
                onBlur={() => setFocusedField(null)}
                placeholder="e.g., Colorful Beaded Keychain"
                maxLength={100}
                className={`w-full px-4 py-3 sm:py-3.5 text-sm sm:text-base bg-white border-2 rounded-xl transition-all duration-200 outline-none text-black ${
                  focusedField === 'name'
                    ? 'border-purple-500 ring-4 ring-purple-200 shadow-md'
                    : 'border-purple-200 hover:border-purple-300'
                }`}
              />
              <p className="text-xs text-gray-500">{formData.name.length}/100</p>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">Description *</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={onInputChange}
                onFocus={() => setFocusedField('description')}
                onBlur={() => setFocusedField(null)}
                placeholder="Describe your product in detail..."
                rows={4}
                maxLength={500}
                className={`w-full px-4 py-3 sm:py-3.5 text-sm sm:text-base bg-white border-2 rounded-xl transition-all duration-200 outline-none resize-none text-black ${
                  focusedField === 'description'
                    ? 'border-purple-500 ring-4 ring-purple-200 shadow-md'
                    : 'border-purple-200 hover:border-purple-300'
                }`}
              />
              <p className="text-xs text-gray-500">{formData.description.length}/500</p>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">Category *</label>
              <select
                name="category"
                value={formData.category}
                onChange={onInputChange}
                onFocus={() => setFocusedField('category')}
                onBlur={() => setFocusedField(null)}
                className={`w-full px-4 py-3 sm:py-3.5 text-sm sm:text-base bg-white border-2 rounded-xl transition-all duration-200 outline-none appearance-none cursor-pointer text-black ${
                  focusedField === 'category'
                    ? 'border-purple-500 ring-4 ring-purple-200 shadow-md'
                    : 'border-purple-200 hover:border-purple-300'
                }`}
              >
                <option value="">Select a category</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat.charAt(0).toUpperCase() + cat.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">Price (₱) *</label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={onInputChange}
                onFocus={() => setFocusedField('price')}
                onBlur={() => setFocusedField(null)}
                min={0}
                step={0.01}
                placeholder="0.00"
                className={`w-full px-4 py-3 sm:py-3.5 text-sm sm:text-base bg-white border-2 rounded-xl transition-all duration-200 outline-none text-black ${
                  focusedField === 'price'
                    ? 'border-purple-500 ring-4 ring-purple-200 shadow-md'
                    : 'border-purple-200 hover:border-purple-300'
                }`}
              />
            </div>
          </div>

          {/* Right Column - Multi-image Gallery */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="block text-sm font-semibold text-gray-700">
                Product Images * <span className="text-xs text-gray-500 font-normal">(up to {MAX_PRODUCT_IMAGES})</span>
              </label>
              <span className="text-xs font-semibold text-purple-600">
                {images.length}/{MAX_PRODUCT_IMAGES}
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2 sm:gap-3">
              {images.map((img, idx) => (
                <div
                  key={img.id}
                  className="relative group aspect-square rounded-xl overflow-hidden border-2 border-purple-200 bg-white shadow-sm"
                >
                  <img src={img.preview} alt={`Image ${idx + 1}`} className="w-full h-full object-cover" />

                  {idx === 0 && (
                    <div className="absolute top-1.5 left-1.5 flex items-center gap-1 px-2 py-0.5 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white text-[10px] font-bold shadow">
                      <Star className="w-3 h-3 fill-current" />
                      Cover
                    </div>
                  )}

                  <button
                    type="button"
                    onClick={() => onRemoveImage(img.id)}
                    disabled={uploading}
                    aria-label="Remove image"
                    className="absolute top-1.5 right-1.5 w-6 h-6 flex items-center justify-center bg-white/95 hover:bg-red-500 hover:text-white text-red-500 rounded-full shadow transition-all disabled:opacity-50"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>

                  <div className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-1 px-1 py-1 bg-gradient-to-t from-black/55 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      type="button"
                      onClick={() => onReorderImage(img.id, 'left')}
                      disabled={uploading || idx === 0}
                      aria-label="Move image left"
                      className="p-1 rounded-md bg-white/90 hover:bg-white text-gray-700 disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                      <ArrowLeft className="w-3.5 h-3.5" />
                    </button>
                    <span className="text-[10px] font-bold text-white">{idx + 1}</span>
                    <button
                      type="button"
                      onClick={() => onReorderImage(img.id, 'right')}
                      disabled={uploading || idx === images.length - 1}
                      aria-label="Move image right"
                      className="p-1 rounded-md bg-white/90 hover:bg-white text-gray-700 disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}

              {canAddMore && (
                <label
                  htmlFor="image-input"
                  className="flex flex-col items-center justify-center aspect-square border-4 border-dashed border-purple-300 bg-purple-50 hover:border-purple-500 hover:bg-purple-100 rounded-xl cursor-pointer transition-all duration-300 text-center px-2"
                >
                  <div className="p-2 bg-gradient-to-br from-purple-400 to-pink-400 rounded-lg mb-1">
                    <ImagePlus className="w-5 h-5 text-white" />
                  </div>
                  <p className="text-xs font-semibold text-gray-700 leading-tight">Add image</p>
                  <p className="text-[10px] text-gray-500 mt-0.5">{remainingSlots} left</p>
                </label>
              )}
            </div>

            <input
              type="file"
              accept="image/*"
              multiple
              onChange={(e) => {
                if (e.target.files && e.target.files.length > 0) {
                  onAddImages(e.target.files);
                }
                e.target.value = '';
              }}
              className="hidden"
              id="image-input"
              disabled={!canAddMore}
            />

            <p className="text-xs text-gray-500">
              The first image is used as the cover. PNG, JPG, GIF up to 50MB each.
            </p>
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={uploading || !isFormValid}
          className={`w-full flex items-center justify-center gap-2 px-6 py-3 sm:py-4 font-semibold rounded-xl transition-all duration-300 text-white text-sm sm:text-base ${
            uploading || !isFormValid
              ? 'bg-gray-400 cursor-not-allowed opacity-60'
              : 'bg-gradient-to-r from-purple-500 via-pink-500 to-orange-400 hover:from-purple-600 hover:via-pink-600 hover:to-orange-500 hover:shadow-lg hover:scale-105 active:scale-95'
          }`}
        >
          {uploading ? (
            <>
              <Loader className="w-5 h-5 animate-spin" />
              <span>Uploading...</span>
            </>
          ) : (
            <>
              <Upload className="w-5 h-5" />
              <span>Upload Product</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
};
