'use client';

import React, { useState } from 'react';
import { Trash2, AlertCircle } from 'lucide-react';
import { Product } from '@/app/types/product';

interface ProductCardProps {
  product: Product;
  loading: boolean;
  onDelete: (id: string, imageUrl: string) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  loading,
  onDelete,
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

  return (
    <div className="group h-full bg-white rounded-2xl overflow-hidden border-2 border-purple-100 hover:border-purple-300 transition-all duration-300 shadow-md hover:shadow-xl flex flex-col">
      {/* Image Section */}
      <div className="relative h-40 sm:h-48 overflow-hidden bg-gradient-to-br from-purple-100 to-pink-100">
        <img
          src={product.image_url}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          loading="lazy"
        />
        
        {/* Overlay on hover */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300" />
      </div>

      {/* Content Section */}
      <div className="p-4 sm:p-5 flex flex-col flex-grow">
        {/* Product Name */}
        <h3 className="text-base sm:text-lg font-bold text-gray-800 mb-2 line-clamp-2">
          {product.name}
        </h3>

        {/* Description */}
        <p className="text-xs sm:text-sm text-gray-600 mb-3 line-clamp-2 flex-grow">
          {product.description}
        </p>

        {/* Category Badge */}
        <div className="flex items-center justify-between mb-4">
          <span className="inline-block px-3 py-1.5 bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 text-xs font-semibold rounded-full capitalize border border-purple-200">
            {product.category}
          </span>
          {product.price && (
            <span className="text-sm sm:text-base font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
              ₱{parseFloat(product.price as any).toFixed(2)}
            </span>
          )}
        </div>

        {/* Delete Button */}
        {!showDeleteConfirm ? (
          <button
            onClick={() => setShowDeleteConfirm(true)}
            disabled={loading || isDeleting}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 sm:py-3 text-sm sm:text-base bg-red-50 hover:bg-red-100 text-red-700 font-semibold rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-md active:scale-95"
          >
            <Trash2 className="w-4 h-4" />
            <span>Delete</span>
          </button>
        ) : (
          <div className="space-y-2 animate-in fade-in">
            <p className="text-xs sm:text-sm text-red-700 font-semibold flex items-center gap-2">
              <AlertCircle className="w-4 h-4" />
              Confirm delete?
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                disabled={isDeleting}
                className="flex-1 px-3 py-2 text-xs sm:text-sm bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold rounded-lg transition-all disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="flex-1 px-3 py-2 text-xs sm:text-sm bg-red-500 hover:bg-red-600 text-white font-semibold rounded-lg transition-all disabled:opacity-50 active:scale-95"
              >
                {isDeleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};