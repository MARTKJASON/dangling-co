'use client';

import React, { useState } from 'react';
import { Upload, Loader, Image as ImageIcon, X, AlertCircle } from 'lucide-react';
import { Plus } from 'lucide-react';
import { Category } from '@/app/components/CategoryTabs';

interface ProductFormProps {
  formData: {
    name: string;
    description: string;
    category: Category;
    price: number | string;
  };
  imagePreview: string;
  uploading: boolean;
  error?: string | null;
  categories: Category[];
  onInputChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => void;
  onImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onImageRemove: () => void;
  onSubmit: (e: React.FormEvent) => void;
}

export const ProductForm: React.FC<ProductFormProps> = ({
  formData,
  imagePreview,
  uploading,
  error,
  categories,
  onInputChange,
  onImageChange,
  onImageRemove,
  onSubmit,
}) => {
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const isFormValid = formData.name && formData.description && formData.category && formData.price && imagePreview;

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
        {/* Grid Layout - Responsive */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column - Form Inputs */}
          <div className="space-y-5">
            {/* Product Name */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">
                Product Name *
              </label>
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

            {/* Description */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">
                Description *
              </label>
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

            {/* Category */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">
                Category *
              </label>
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

            {/* Price */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">
                Price (₱) *
              </label>
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

          {/* Right Column - Image Upload */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700">
              Product Image *
            </label>
            <div className="relative">
              <input
                type="file"
                accept="image/*"
                onChange={onImageChange}
                className="hidden"
                id="image-input"
                disabled={uploading}
              />
              <label
                htmlFor="image-input"
                className={`flex flex-col items-center justify-center w-full aspect-square border-4 border-dashed rounded-2xl cursor-pointer transition-all duration-300 ${
                  uploading
                    ? 'border-gray-300 bg-gray-50 opacity-50 cursor-not-allowed'
                    : imagePreview
                    ? 'border-purple-300 bg-white'
                    : 'border-purple-300 bg-purple-50 hover:border-purple-500 hover:bg-purple-100'
                }`}
              >
                {imagePreview ? (
                  <div className="relative w-full h-full">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-full h-full object-cover rounded-xl"
                    />
                    <div className="absolute inset-0 bg-black/0 hover:bg-black/10 rounded-xl transition-all flex items-center justify-center opacity-0 hover:opacity-100">
                      <p className="text-white text-sm font-semibold">Change image</p>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-8 px-4 text-center">
                    <div className="p-3 bg-gradient-to-br from-purple-400 to-pink-400 rounded-lg mb-3">
                      <ImageIcon className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                    </div>
                    <p className="text-sm font-semibold text-gray-700">Click to upload</p>
                    <p className="text-xs text-gray-500 mt-1">PNG, JPG, GIF up to 50MB</p>
                  </div>
                )}
              </label>
            </div>
            {imagePreview && (
              <button
                type="button"
                onClick={onImageRemove}
                className="text-sm text-red-500 hover:text-red-700 font-semibold flex items-center gap-1 hover:gap-2 transition-all"
              >
                <X className="w-4 h-4" />
                Remove Image
              </button>
            )}
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