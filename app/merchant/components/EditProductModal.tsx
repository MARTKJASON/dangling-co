'use client';

import React, { useRef } from 'react';
import { X, Upload, ImagePlus, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Product } from '@/app/types/product';
import { Category } from '@/app/components/CategoryTabs';

interface EditFormData {
  name: string;
  description: string;
  category: string;
  price: number;
}

interface EditProductModalProps {
  product: Product;
  formData: EditFormData;
  imagePreview: string | null;
  updating: boolean;
  error: string | null;
  categories: Category[];
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  onImageChange: (file: File) => void;
  onImageRemove: () => void;
  onSubmit: (e: React.FormEvent) => void;
  onClose: () => void;
}

export const EditProductModal: React.FC<EditProductModalProps> = ({
  product,
  formData,
  imagePreview,
  updating,
  error,
  categories,
  onInputChange,
  onImageChange,
  onImageRemove,
  onSubmit,
  onClose,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const currentImage = imagePreview ?? product.image_url;

  // Close on backdrop click
  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in"
      onClick={handleBackdropClick}
    >
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-purple-100 animate-in zoom-in-95 slide-in-from-bottom-4 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-purple-100 bg-gradient-to-r from-purple-50 to-pink-50">
          <div>
            <h2 className="text-lg font-bold text-gray-900">Edit Product</h2>
            <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">{product.name}</p>
          </div>
          <button
            onClick={onClose}
            disabled={updating}
            className="p-2 rounded-xl text-gray-400 hover:text-gray-600 hover:bg-white transition-all disabled:opacity-50"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Body */}
        <form onSubmit={onSubmit} className="overflow-y-auto max-h-[calc(100vh-12rem)]">
          <div className="px-6 py-5 space-y-5">
            {/* Error Banner */}
            {error && (
              <div className="flex items-start gap-3 px-4 py-3 bg-red-50 border border-red-200 rounded-xl animate-in fade-in">
                <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}

            {/* Image Upload */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">Product Image</label>
              <div className="relative group">
                <div
                  className={`relative h-48 rounded-xl overflow-hidden border-2 border-dashed transition-all duration-300 cursor-pointer ${
                    currentImage
                      ? 'border-purple-300 bg-purple-50'
                      : 'border-purple-200 bg-gradient-to-br from-purple-50 to-pink-50 hover:border-purple-400'
                  }`}
                  onClick={() => !updating && fileInputRef.current?.click()}
                >
                  {currentImage ? (
                    <>
                      <img
                        src={currentImage}
                        alt="Preview"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-300 flex items-center justify-center">
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center gap-2">
                          <Upload className="w-8 h-8 text-white" />
                          <span className="text-white text-sm font-semibold">Change Image</span>
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
                      <ImagePlus className="w-10 h-10 text-purple-400" />
                      <span className="text-sm text-purple-500 font-medium">Click to upload image</span>
                      <span className="text-xs text-gray-400">PNG, JPG, WebP up to 10MB</span>
                    </div>
                  )}
                </div>

                {/* Remove image (only for newly selected ones) */}
                {imagePreview && (
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); onImageRemove(); }}
                    disabled={updating}
                    className="absolute top-2 right-2 p-1.5 bg-white/90 hover:bg-white rounded-lg shadow-md text-red-500 hover:text-red-700 transition-all disabled:opacity-50"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  disabled={updating}
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) onImageChange(file);
                    e.target.value = '';
                  }}
                />
              </div>
            </div>

            {/* Product Name */}
            <div className="space-y-1.5">
              <label className="block text-sm font-semibold text-gray-700">
                Product Name <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={onInputChange}
                required
                disabled={updating}
                placeholder="e.g. Lavender Dream Bracelet"
                className="w-full px-4 py-2.5 border-2 border-purple-200 rounded-xl focus:outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-100 text-sm text-gray-800 placeholder-gray-400 transition-all disabled:opacity-60 disabled:bg-gray-50"
              />
            </div>

            {/* Description */}
            <div className="space-y-1.5">
              <label className="block text-sm font-semibold text-gray-700">Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={onInputChange}
                rows={3}
                disabled={updating}
                placeholder="Describe your product..."
                className="w-full px-4 py-2.5 border-2 border-purple-200 rounded-xl focus:outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-100 text-sm text-gray-800 placeholder-gray-400 transition-all resize-none disabled:opacity-60 disabled:bg-gray-50"
              />
            </div>

            {/* Category & Price row */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="block text-sm font-semibold text-gray-700">Category</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={onInputChange}
                  disabled={updating}
                  className="w-full px-4 py-2.5 border-2 border-purple-200 rounded-xl focus:outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-100 text-sm text-gray-800 capitalize transition-all disabled:opacity-60 disabled:bg-gray-50 appearance-none bg-white"
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat} className="capitalize">
                      {cat.charAt(0).toUpperCase() + cat.slice(1)}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="block text-sm font-semibold text-gray-700">Price (₱)</label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={onInputChange}
                  min={0}
                  step="0.01"
                  disabled={updating}
                  placeholder="0.00"
                  className="w-full px-4 py-2.5 border-2 border-purple-200 rounded-xl focus:outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-100 text-sm text-gray-800 placeholder-gray-400 transition-all disabled:opacity-60 disabled:bg-gray-50"
                />
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex gap-3 px-6 py-4 border-t border-purple-100 bg-gray-50/50">
            <button
              type="button"
              onClick={onClose}
              disabled={updating}
              className="flex-1 px-4 py-2.5 text-sm font-semibold text-gray-700 bg-white border-2 border-gray-200 rounded-xl hover:border-gray-300 hover:bg-gray-50 transition-all disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={updating || !formData.name.trim()}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl hover:from-purple-600 hover:to-pink-600 shadow-lg hover:shadow-purple-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed active:scale-95"
            >
              {updating ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  Save Changes
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};