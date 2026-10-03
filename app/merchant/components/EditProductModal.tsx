'use client';

import React, { useEffect, useRef } from 'react';
import {
  X,
  ImagePlus,
  Loader2,
  AlertCircle,
  CheckCircle2,
  ArrowLeft,
  ArrowRight,
  Star,
  Repeat,
  Trash2,
} from 'lucide-react';
import { MAX_PRODUCT_IMAGES, Product } from '@/app/types/product';
import { Category } from '@/app/lib/products';
import { getCategoryInfo } from '@/app/lib/categories';
import type { EditImageSlot } from '@/app/hooks/useProductEdit';

interface EditFormData {
  name: string;
  description: string;
  category: string;
  price: number;
}

interface EditProductModalProps {
  product: Product;
  formData: EditFormData;
  imageSlots: EditImageSlot[];
  updating: boolean;
  error: string | null;
  categories: Category[];
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  onAddImages: (files: FileList) => void;
  onReplaceImage: (id: string, file: File) => void;
  onRemoveImage: (id: string) => void;
  onReorderImage: (id: string, direction: 'left' | 'right') => void;
  onSubmit: (e: React.FormEvent) => void;
  onClose: () => void;
}

export const EditProductModal: React.FC<EditProductModalProps> = ({
  product,
  formData,
  imageSlots,
  updating,
  error,
  categories,
  onInputChange,
  onAddImages,
  onReplaceImage,
  onRemoveImage,
  onReorderImage,
  onSubmit,
  onClose,
}) => {
  const addInputRef = useRef<HTMLInputElement>(null);
  const replaceInputRef = useRef<HTMLInputElement>(null);
  const replaceTargetIdRef = useRef<string | null>(null);

  const remainingSlots = Math.max(0, MAX_PRODUCT_IMAGES - imageSlots.length);
  const canAddMore = remainingSlots > 0 && !updating;

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) onClose();
  };

  // Close on Escape (unless a save is in flight).
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !updating) onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [updating, onClose]);

  const triggerReplace = (id: string) => {
    if (updating) return;
    replaceTargetIdRef.current = id;
    replaceInputRef.current?.click();
  };

  const onReplaceFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    const id = replaceTargetIdRef.current;
    if (file && id) onReplaceImage(id, file);
    replaceTargetIdRef.current = null;
    e.target.value = '';
  };

  const previewOf = (slot: EditImageSlot) => (slot.kind === 'pending' ? slot.preview : slot.url);

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-4 bg-ink-900/40 animate-fade-in"
      onClick={handleBackdropClick}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="edit-product-title"
        className="relative w-full sm:max-w-lg max-h-[92vh] sm:max-h-[calc(100vh-2rem)] flex flex-col bg-white rounded-t-sheet sm:rounded-sheet shadow-overlay animate-fade-up overflow-hidden"
      >
        <div className="flex items-center justify-between gap-3 pl-6 pr-3 py-3 border-b border-cream-200">
          <div className="min-w-0">
            <h2 id="edit-product-title" className="font-display text-2xl font-semibold text-ink-900">
              Edit product
            </h2>
            <p className="text-sm text-ink-600 truncate">{product.name}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={updating}
            aria-label="Close"
            className="icon-btn text-ink-600"
          >
            <X className="w-5 h-5" aria-hidden="true" />
          </button>
        </div>

        <form onSubmit={onSubmit} className="flex flex-col min-h-0 flex-1">
          <div className="px-6 py-5 space-y-5 overflow-y-auto flex-1">
            {error && (
              <div role="alert" className="flex items-start gap-3 p-4 bg-cherry-100 text-cherry-700 rounded-field animate-fade-in">
                <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" aria-hidden="true" />
                <p className="text-sm">{error}</p>
              </div>
            )}

            {/* Image Gallery */}
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="block text-sm font-semibold text-ink-900">
                  Photos <span className="font-normal text-ink-600">(up to {MAX_PRODUCT_IMAGES})</span>
                </span>
                <span className="text-sm font-semibold text-ink-600 tabular-nums">
                  {imageSlots.length}/{MAX_PRODUCT_IMAGES}
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2.5">
                {imageSlots.map((slot, idx) => (
                  <div
                    key={slot.id}
                    className="relative group aspect-square rounded-field overflow-hidden bg-cream-200"
                  >
                    <img src={previewOf(slot)} alt={`Photo ${idx + 1}`} className="w-full h-full object-cover" />

                    {idx === 0 && (
                      <div className="absolute top-1.5 left-1.5 z-10 flex items-center gap-1 px-2 py-0.5 rounded-full bg-white text-ink-900 text-xs font-semibold shadow-rest">
                        <Star className="w-3 h-3 fill-butter-400 text-butter-800" aria-hidden="true" />
                        Cover
                      </div>
                    )}

                    {slot.kind === 'pending' && (
                      <div className="absolute top-1.5 right-1.5 z-10 px-2 py-0.5 rounded-full bg-butter-400 text-ink-900 text-xs font-semibold shadow-rest">
                        New
                      </div>
                    )}

                    <div className="absolute inset-0 flex flex-col justify-between bg-ink-900/45 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 sm:group-focus-within:opacity-100 transition-opacity">
                      <div className="flex-1 flex items-center justify-center gap-1.5 pt-6">
                        <button
                          type="button"
                          onClick={() => triggerReplace(slot.id)}
                          disabled={updating}
                          aria-label={`Replace photo ${idx + 1}`}
                          title="Replace photo"
                          className="w-8 h-8 flex items-center justify-center rounded-full bg-white text-peri-700 hover:bg-peri-50 shadow-rest disabled:opacity-50"
                        >
                          <Repeat className="w-4 h-4" aria-hidden="true" />
                        </button>
                        <button
                          type="button"
                          onClick={() => onRemoveImage(slot.id)}
                          disabled={updating}
                          aria-label={`Remove photo ${idx + 1}`}
                          title="Remove photo"
                          className="w-8 h-8 flex items-center justify-center rounded-full bg-white text-cherry-700 hover:bg-cherry-100 shadow-rest disabled:opacity-50"
                        >
                          <Trash2 className="w-4 h-4" aria-hidden="true" />
                        </button>
                      </div>
                      <div className="flex items-center justify-between gap-1 p-1">
                        <button
                          type="button"
                          onClick={() => onReorderImage(slot.id, 'left')}
                          disabled={updating || idx === 0}
                          aria-label={`Move photo ${idx + 1} earlier`}
                          className="w-7 h-7 flex items-center justify-center rounded-full bg-white/95 hover:bg-white text-ink-900 disabled:opacity-30 disabled:cursor-not-allowed"
                        >
                          <ArrowLeft className="w-3.5 h-3.5" aria-hidden="true" />
                        </button>
                        <span className="text-xs font-semibold text-white">{idx + 1}</span>
                        <button
                          type="button"
                          onClick={() => onReorderImage(slot.id, 'right')}
                          disabled={updating || idx === imageSlots.length - 1}
                          aria-label={`Move photo ${idx + 1} later`}
                          className="w-7 h-7 flex items-center justify-center rounded-full bg-white/95 hover:bg-white text-ink-900 disabled:opacity-30 disabled:cursor-not-allowed"
                        >
                          <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}

                {canAddMore && (
                  <button
                    type="button"
                    onClick={() => addInputRef.current?.click()}
                    disabled={!canAddMore}
                    className="flex flex-col items-center justify-center aspect-square border-2 border-dashed border-cream-300 bg-cream-50 hover:border-peri-300 hover:bg-peri-50 rounded-card transition-colors text-center px-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ImagePlus className="w-6 h-6 text-peri-600 mb-1" aria-hidden="true" />
                    <span className="text-sm font-semibold text-ink-900 leading-tight">Add photo</span>
                    <span className="text-xs text-ink-600 mt-0.5">{remainingSlots} left</span>
                  </button>
                )}

                {imageSlots.length === 0 && !canAddMore && (
                  <p className="col-span-3 text-sm text-ink-600">Add at least one photo to save changes.</p>
                )}
              </div>

              <p className="text-[13px] text-ink-600">
                The first photo is the cover. Hover or tap a photo to replace, remove or reorder it.
              </p>

              <input
                ref={addInputRef}
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                disabled={!canAddMore}
                onChange={(e) => {
                  if (e.target.files && e.target.files.length > 0) {
                    onAddImages(e.target.files);
                  }
                  e.target.value = '';
                }}
              />
              <input
                ref={replaceInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                disabled={updating}
                onChange={onReplaceFileChange}
              />
            </div>

            {/* Product Name */}
            <div className="space-y-2">
              <label htmlFor="edit-name" className="block text-sm font-semibold text-ink-900">
                Product name <span className="text-cherry-700">*</span>
              </label>
              <input
                id="edit-name"
                type="text"
                name="name"
                value={formData.name}
                onChange={onInputChange}
                required
                disabled={updating}
                placeholder="e.g. Lavender dream bracelet"
                className="field disabled:opacity-60"
              />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <label htmlFor="edit-description" className="block text-sm font-semibold text-ink-900">
                Description
              </label>
              <textarea
                id="edit-description"
                name="description"
                value={formData.description}
                onChange={onInputChange}
                rows={3}
                disabled={updating}
                placeholder="Describe your product…"
                className="field resize-none disabled:opacity-60"
              />
            </div>

            {/* Category & Price row */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="edit-category" className="block text-sm font-semibold text-ink-900">
                  Category
                </label>
                <select
                  id="edit-category"
                  name="category"
                  value={formData.category}
                  onChange={onInputChange}
                  disabled={updating}
                  className="field cursor-pointer disabled:opacity-60"
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {getCategoryInfo(cat)?.label ?? cat}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label htmlFor="edit-price" className="block text-sm font-semibold text-ink-900">
                  Price (₱)
                </label>
                <input
                  id="edit-price"
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={onInputChange}
                  min={0}
                  step="0.01"
                  inputMode="decimal"
                  disabled={updating}
                  placeholder="0.00"
                  className="field tabular-nums disabled:opacity-60"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-2 px-6 py-4 border-t border-cream-200 bg-cream-50">
            <button type="button" onClick={onClose} disabled={updating} className="btn btn-ghost">
              Cancel
            </button>
            <button
              type="submit"
              disabled={updating || !formData.name.trim() || imageSlots.length === 0}
              className="btn btn-primary"
            >
              {updating ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
                  Saving…
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" aria-hidden="true" />
                  Save changes
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
