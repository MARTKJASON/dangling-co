import React from 'react';
import { Trash2 } from 'lucide-react';
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
  return (
    <div className="bg-white rounded-xl overflow-hidden border-2 border-purple-100 hover:border-purple-300 transition-all duration-300 shadow-md hover:shadow-xl group">
      {/* Image */}
      <div className="relative h-48 overflow-hidden bg-gray-100">
        <img
          src={product.image_url}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
        />
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="text-lg font-bold text-gray-800 mb-2">{product.name}</h3>
        <p className="text-sm text-gray-600 mb-3 line-clamp-2">{product.description}</p>

        <div className="flex items-center justify-between mb-4">
          <span className="inline-block px-3 py-1 bg-purple-100 text-purple-700 text-xs font-semibold rounded-full capitalize">
            {product.category}
          </span>
        </div>

        {/* Actions */}
        <button
          onClick={() => onDelete(product.id, product.image_url)}
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-red-100 hover:bg-red-200 text-red-700 font-semibold rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Trash2 className="w-4 h-4" />
          Delete
        </button>
      </div>
    </div>
  );
};