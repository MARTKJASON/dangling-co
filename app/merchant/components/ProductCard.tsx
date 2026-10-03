'use client';

import React, { useState } from 'react';
import { Trash2, AlertCircle, Pencil, Loader2 } from 'lucide-react';
import { Product } from '@/app/types/product';
import { getCategoryInfo } from '@/app/lib/categories';
import { formatPeso } from '@/app/lib/format';

interface ProductCardProps {
  product: Product;
  loading: boolean;
  onDelete: (id: string, imageUrl: string) => void;
  onEdit: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  loading,
  onDelete,
  onEdit,
}) => {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await onDelete(product.id, product.image_url);
      setShowDeleteConfirm(false);
    } finally {
      setIsDeleting(false);
    }
  };

  const categoryLabel = getCategoryInfo(product.category)?.singular ?? product.category;

  return (
    <div className="h-full bg-white rounded-card overflow-hidden border border-cream-300 shadow-rest hover:shadow-raised transition-shadow flex flex-col">
      {/* Image */}
      <div className="relative aspect-square overflow-hidden bg-cream-200">
        <img
          src={product.image_url}
          alt={product.name}
          className="w-full h-full object-cover"
          loading="lazy"
        />
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col flex-grow gap-1.5">
        <p className="eyebrow">{categoryLabel}</p>
        <h3 className="font-display text-lg font-semibold text-ink-900 leading-snug line-clamp-2">
          {product.name}
        </h3>
        <p className="text-sm text-ink-600 line-clamp-2 flex-grow">{product.description}</p>
        {product.price ? (
          <p className="text-base font-bold text-ink-900 tabular-nums mt-1">{formatPeso(product.price)}</p>
        ) : null}

        {/* Actions */}
        {!showDeleteConfirm ? (
          <div className="flex items-center gap-2 mt-3">
            <button
              type="button"
              onClick={() => onEdit(product)}
              disabled={loading || isDeleting}
              className="btn btn-secondary btn-sm flex-1"
            >
              <Pencil className="w-4 h-4" aria-hidden="true" />
              Edit
            </button>
            <button
              type="button"
              onClick={() => setShowDeleteConfirm(true)}
              disabled={loading || isDeleting}
              aria-label={`Delete ${product.name}`}
              className="icon-btn text-cherry-700 hover:bg-cherry-100"
            >
              <Trash2 className="w-5 h-5" aria-hidden="true" />
            </button>
          </div>
        ) : (
          <div className="mt-3 p-3 rounded-field bg-cherry-100 space-y-2.5 animate-fade-in" role="alert">
            <p className="text-sm text-cherry-700 font-semibold flex items-center gap-2">
              <AlertCircle className="w-4 h-4" aria-hidden="true" />
              Delete this product?
            </p>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setShowDeleteConfirm(false)}
                disabled={isDeleting}
                className="btn btn-secondary btn-sm flex-1"
              >
                Keep
              </button>
              <button
                type="button"
                onClick={handleDelete}
                disabled={isDeleting}
                className="btn btn-sm flex-1 bg-cherry-600 text-white hover:bg-cherry-700"
              >
                {isDeleting ? <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" /> : <Trash2 className="w-4 h-4" aria-hidden="true" />}
                {isDeleting ? 'Deleting…' : 'Delete'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
