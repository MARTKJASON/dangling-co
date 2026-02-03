import Link from 'next/link';
import React, { FC } from 'react';
import { Sparkles, ArrowRight } from 'lucide-react';

// Type Definitions
interface Product {
  id: string;
  name: string;
  price: string;
  image_url: string;
}

interface ProductsByCategory {
  [key: string]: Product[];
}

interface ProductCardProps {
  product: Product;
   onClick?: () => void;
}

// Color schemes for different price ranges (visual interest)
const getPriceColor = (price: string): string => {
  const numPrice = parseInt(price);
  
  if (numPrice < 30) return 'from-blue-400 to-cyan-400';
  if (numPrice < 60) return 'from-purple-400 to-pink-400';
  if (numPrice < 90) return 'from-amber-400 to-orange-400';
  return 'from-rose-400 to-red-400';
};

const ProductCard: FC<ProductCardProps> = ({ product }) => {
  const priceGradient = getPriceColor(product.price);

  return (
    <Link href={`/product/${product.id}`} className="block group h-full">
      <div className="relative h-full bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 cursor-pointer border border-gray-100 hover:border-gray-200">
        
        {/* Decorative Gradient Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-purple-50/20 pointer-events-none" />

        {/* Image Container with Bead Effect */}
        <div className="relative h-64 md:h-72 overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100">
          {/* Shine effect */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
          
          {/* Main Image */}
          <img
            src={product.image_url}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 ease-out"
          />
          
          {/* Overlay with Glow */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          {/* Floating Badge */}
          <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full shadow-lg transform translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
            <span className="text-xs font-bold text-purple-600 flex items-center gap-1">
              <Sparkles className="w-3 h-3" />
              View
            </span>
          </div>
        </div>

        {/* Content Section */}
        <div className="relative p-4 md:p-5 flex flex-col h-28 md:h-32 justify-between">
          
          {/* Product Name */}
          <div>
            <h3 className="text-sm md:text-base font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-purple-700 transition-colors duration-300">
              {product.name}
            </h3>
          </div>

          {/* Price and CTA */}
          <div className="flex items-end justify-between gap-2">
            {/* Price with Gradient */}
            <div className="flex-1">
              <p className={`text-base md:text-lg font-black bg-gradient-to-r ${priceGradient} bg-clip-text text-transparent`}>
               ₱ {product.price}
              </p>
            </div>

            {/* Arrow Icon */}
            <div className="flex-shrink-0 p-2 bg-gradient-to-br from-amber-300 to-orange-400 rounded-lg transform translate-x-1 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-300 shadow-lg">
              <ArrowRight className="w-5 h-5 text-white group-hover:scale-110 transition-transform duration-300" />
            </div>
          </div>
        </div>

        {/* Bottom Shimmer Line */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-purple-400 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>
    </Link>
  );
};

export default ProductCard;