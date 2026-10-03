'use client';

import React from 'react';
import { Upload, Loader2, ImagePlus, X, AlertCircle, ArrowLeft, ArrowRight, Star } from 'lucide-react';
import { Category } from '@/app/lib/products';
import { getCategoryInfo } from '@/app/lib/categories';
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
  const isFormValid =
    formData.name && formData.description && formData.category && formData.price && images.length > 0;
  const remainingSlots = Math.max(0, MAX_PRODUCT_IMAGES - images.length);
  const canAddMore = remainingSlots > 0 && !uploading;

  return (
    <div className="w-full bg-white rounded-card border border-cream-300 p-6">
      {/* Header */}
      <div className="mb-6 space-y-1">
        <h2 className="font-display text-2xl font-semibold text-ink-900">Add a product</h2>
        <p className="text-sm text-ink-600">Fill in the details below. Fields marked * are required.</p>
      </div>

      {/* Error Alert */}
      {error && (
        <div role="alert" className="mb-6 p-4 bg-cherry-100 text-cherry-700 rounded-field flex gap-3 animate-fade-in">
          <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" aria-hidden="true" />
          <div>
            <p className="text-sm font-semibold">Couldn&apos;t upload</p>
            <p className="text-sm">{error}</p>
          </div>
        </div>
      )}

      <form onSubmit={onSubmit} className="space-y-5">
        <div className="space-y-2">
          <label htmlFor="product-name" className="block text-sm font-semibold text-ink-900">
            Product name *
          </label>
          <input
            id="product-name"
            type="text"
            name="name"
            value={formData.name}
            onChange={onInputChange}
            placeholder="e.g. Colorful beaded keychain"
            maxLength={100}
            className="field"
          />
          <p className="text-[13px] text-ink-600 text-right tabular-nums">{formData.name.length}/100</p>
        </div>

        <div className="space-y-2">
          <label htmlFor="product-description" className="block text-sm font-semibold text-ink-900">
            Description *
          </label>
          <textarea
            id="product-description"
            name="description"
            value={formData.description}
            onChange={onInputChange}
            placeholder="Describe the colors, beads and size…"
            rows={4}
            maxLength={500}
            className="field resize-none"
          />
          <p className="text-[13px] text-ink-600 text-right tabular-nums">{formData.description.length}/500</p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label htmlFor="product-category" className="block text-sm font-semibold text-ink-900">
              Category *
            </label>
            <select
              id="product-category"
              name="category"
              value={formData.category}
              onChange={onInputChange}
              className="field cursor-pointer"
            >
              <option value="">Select a category</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {getCategoryInfo(cat)?.label ?? cat}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label htmlFor="product-price" className="block text-sm font-semibold text-ink-900">
              Price (₱) *
            </label>
            <input
              id="product-price"
              type="number"
              name="price"
              value={formData.price}
              onChange={onInputChange}
              min={0}
              step={0.01}
              inputMode="decimal"
              placeholder="0.00"
              className="field tabular-nums"
            />
          </div>
        </div>

        {/* Multi-image Gallery */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="block text-sm font-semibold text-ink-900">
              Photos * <span className="font-normal text-ink-600">(up to {MAX_PRODUCT_IMAGES})</span>
            </span>
            <span className="text-sm font-semibold text-ink-600 tabular-nums">
              {images.length}/{MAX_PRODUCT_IMAGES}
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2.5">
            {images.map((img, idx) => (
              <div
                key={img.id}
                className="relative group aspect-square rounded-field overflow-hidden bg-cream-200"
              >
                <img src={img.preview} alt={`Photo ${idx + 1}`} className="w-full h-full object-cover" />

                {idx === 0 && (
                  <div className="absolute top-1.5 left-1.5 flex items-center gap-1 px-2 py-0.5 rounded-full bg-white text-ink-900 text-xs font-semibold shadow-rest">
                    <Star className="w-3 h-3 fill-butter-400 text-butter-800" aria-hidden="true" />
                    Cover
                  </div>
                )}

                <button
                  type="button"
                  onClick={() => onRemoveImage(img.id)}
                  disabled={uploading}
                  aria-label={`Remove photo ${idx + 1}`}
                  className="absolute top-1 right-1 w-8 h-8 flex items-center justify-center bg-white/95 hover:bg-cherry-100 text-cherry-700 rounded-full shadow-rest transition-colors disabled:opacity-50"
                >
                  <X className="w-4 h-4" aria-hidden="true" />
                </button>

                <div className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-1 p-1 bg-ink-900/55 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 sm:group-focus-within:opacity-100 transition-opacity">
                  <button
                    type="button"
                    onClick={() => onReorderImage(img.id, 'left')}
                    disabled={uploading || idx === 0}
                    aria-label={`Move photo ${idx + 1} earlier`}
                    className="w-7 h-7 flex items-center justify-center rounded-full bg-white/95 hover:bg-white text-ink-900 disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" aria-hidden="true" />
                  </button>
                  <span className="text-xs font-semibold text-white">{idx + 1}</span>
                  <button
                    type="button"
                    onClick={() => onReorderImage(img.id, 'right')}
                    disabled={uploading || idx === images.length - 1}
                    aria-label={`Move photo ${idx + 1} later`}
                    className="w-7 h-7 flex items-center justify-center rounded-full bg-white/95 hover:bg-white text-ink-900 disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                  </button>
                </div>
              </div>
            ))}

            {canAddMore && (
              <label
                htmlFor="image-input"
                className="flex flex-col items-center justify-center aspect-square border-2 border-dashed border-cream-300 bg-cream-50 hover:border-peri-300 hover:bg-peri-50 rounded-card cursor-pointer transition-colors text-center px-2 focus-within:border-peri-600"
              >
                <ImagePlus className="w-6 h-6 text-peri-600 mb-1" aria-hidden="true" />
                <span className="text-sm font-semibold text-ink-900 leading-tight">Add photo</span>
                <span className="text-xs text-ink-600 mt-0.5">{remainingSlots} left</span>
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
            className="sr-only"
            id="image-input"
            disabled={!canAddMore}
          />

          <p className="text-[13px] text-ink-600">
            The first photo is the cover. PNG, JPG or GIF, up to 50MB each.
          </p>
        </div>

        <button
          type="submit"
          disabled={uploading || !isFormValid}
          className="btn btn-primary w-full"
        >
          {uploading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" aria-hidden="true" />
              <span>Uploading…</span>
            </>
          ) : (
            <>
              <Upload className="w-5 h-5" aria-hidden="true" />
              <span>Upload product</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
};
