'use client';

import React, { useRef } from 'react';
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
import { Category } from '@/app/components/CategoryTabs';
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
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in"
      onClick={handleBackdropClick}
    >
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-purple-100 animate-in zoom-in-95 slide-in-from-bottom-4 overflow-hidden">
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

        <form onSubmit={onSubmit} className="overflow-y-auto max-h-[calc(100vh-12rem)]">
          <div className="px-6 py-5 space-y-5">
            {error && (
              <div className="flex items-start gap-3 px-4 py-3 bg-red-50 border border-red-200 rounded-xl animate-in fade-in">
                <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}

            {/* Image Gallery */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="block text-sm font-semibold text-gray-700">
                  Product Images <span className="text-xs text-gray-500 font-normal">(up to {MAX_PRODUCT_IMAGES})</span>
                </label>
                <span className="text-xs font-semibold text-purple-600">
                  {imageSlots.length}/{MAX_PRODUCT_IMAGES}
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2">
                {imageSlots.map((slot, idx) => (
                  <div
                    key={slot.id}
                    className="relative group aspect-square rounded-xl overflow-hidden border-2 border-purple-200 bg-white shadow-sm"
                  >
                    <img src={previewOf(slot)} alt={`Image ${idx + 1}`} className="w-full h-full object-cover" />

                    {idx === 0 && (
                      <div className="absolute top-1.5 left-1.5 flex items-center gap-1 px-2 py-0.5 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white text-[10px] font-bold shadow">
                        <Star className="w-3 h-3 fill-current" />
                        Cover
                      </div>
                    )}

                    {slot.kind === 'pending' && (
                      <div className="absolute top-1.5 right-1.5 px-2 py-0.5 rounded-full bg-amber-500 text-white text-[10px] font-bold shadow">
                        New
                      </div>
                    )}

                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/45 transition-colors duration-200 flex items-center justify-center gap-1 opacity-0 group-hover:opacity-100">
                      <button
                        type="button"
                        onClick={() => triggerReplace(slot.id)}
                        disabled={updating}
                        title="Replace image"
                        className="p-1.5 rounded-lg bg-white/95 hover:bg-white text-purple-600 shadow disabled:opacity-50"
                      >
                        <Repeat className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => onRemoveImage(slot.id)}
                        disabled={updating}
                        title="Remove image"
                        className="p-1.5 rounded-lg bg-white/95 hover:bg-red-500 hover:text-white text-red-500 shadow disabled:opacity-50"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-1 px-1 py-1 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        type="button"
                        onClick={() => onReorderImage(slot.id, 'left')}
                        disabled={updating || idx === 0}
                        aria-label="Move left"
                        className="p-1 rounded-md bg-white/90 hover:bg-white text-gray-700 disabled:opacity-30 disabled:cursor-not-allowed"
                      >
                        <ArrowLeft className="w-3.5 h-3.5" />
                      </button>
                      <span className="text-[10px] font-bold text-white">{idx + 1}</span>
                      <button
                        type="button"
                        onClick={() => onReorderImage(slot.id, 'right')}
                        disabled={updating || idx === imageSlots.length - 1}
                        aria-label="Move right"
                        className="p-1 rounded-md bg-white/90 hover:bg-white text-gray-700 disabled:opacity-30 disabled:cursor-not-allowed"
                      >
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}

                {canAddMore && (
                  <button
                    type="button"
                    onClick={() => addInputRef.current?.click()}
                    disabled={!canAddMore}
                    className="flex flex-col items-center justify-center aspect-square border-2 border-dashed border-purple-300 bg-gradient-to-br from-purple-50 to-pink-50 hover:border-purple-500 hover:bg-purple-100 rounded-xl cursor-pointer transition-all duration-300 text-center px-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ImagePlus className="w-6 h-6 text-purple-500 mb-1" />
                    <span className="text-xs font-semibold text-purple-600 leading-tight">Add image</span>
                    <span className="text-[10px] text-gray-500 mt-0.5">{remainingSlots} left</span>
                  </button>
                )}

                {imageSlots.length === 0 && !canAddMore && (
                  <p className="col-span-3 text-xs text-gray-500">Add at least one image to save changes.</p>
                )}
              </div>

              <p className="text-xs text-gray-500">
                The first image is used as the cover. Hover an image to replace, remove, or reorder it.
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
              disabled={updating || !formData.name.trim() || imageSlots.length === 0}
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
