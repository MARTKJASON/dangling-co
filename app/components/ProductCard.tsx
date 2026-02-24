import Link from 'next/link';
import Image from 'next/image';
import React, { FC } from 'react';
import { Gem, ArrowUpRight } from 'lucide-react';

// Type Definitions
interface Product {
  id: string;
  name: string;
  price: string;
  description: string;
  image_url: string;
}

interface ProductCardProps {
  product: Product;
  onClick?: () => void;
}

// Category-aware accent colors for the price tag ribbon
const getPriceStyle = (price: string) => {
  const n = parseInt(price);
  if (n < 30) return { ribbon: 'from-sky-400 to-cyan-300', glow: 'shadow-cyan-200' };
  if (n < 60) return { ribbon: 'from-violet-500 to-purple-400', glow: 'shadow-purple-200' };
  if (n < 90) return { ribbon: 'from-amber-400 to-orange-400', glow: 'shadow-amber-200' };
  return { ribbon: 'from-rose-500 to-pink-400', glow: 'shadow-rose-200' };
};

const ProductCard: FC<ProductCardProps> = ({ product }) => {
  const { ribbon, glow } = getPriceStyle(product.price);

  return (
    <Link href={`/product/${product.id}`} className="block group h-full focus:outline-none">
      <article className="relative h-full flex flex-col bg-white rounded-3xl overflow-hidden border border-purple-100 shadow-md hover:shadow-2xl hover:shadow-purple-100 transition-all duration-500 hover:-translate-y-1">

        {/* ── Image ──────────────────────────────────────────────────── */}
        <div className="relative h-60 md:h-64 overflow-hidden bg-gradient-to-br from-purple-50 to-pink-50 flex-shrink-0">

          {/* Subtle noise texture overlay for depth */}
          <div
            className="absolute inset-0 opacity-[0.03] pointer-events-none z-10"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
            }}
          />

          <Image
            src={product.image_url}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
            placeholder="blur"
            blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjNlOGZmIi8+PC9zdmc+"
          />

          {/* Gradient vignette at the bottom for text readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/5 to-transparent" />

          {/* ── Price ribbon — bottom-left of image ─────────────────── */}
          <div className={`absolute bottom-3 left-3 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r ${ribbon} shadow-lg ${glow} z-20`}>
            <span className="text-xs font-black text-white tracking-wide">₱{product.price}</span>
          </div>

          {/* ── Hover CTA chip — bottom-right of image ───────────────── */}
          <div className="absolute bottom-3 right-3 flex items-center gap-1 px-3 py-1.5 rounded-full bg-white/90 backdrop-blur-sm shadow-md opacity-0 translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 z-20">
            <span className="text-xs font-bold text-purple-700">Shop now</span>
            <ArrowUpRight className="w-3.5 h-3.5 text-purple-500" />
          </div>
        </div>

        {/* ── Content ────────────────────────────────────────────────── */}
        <div className="flex flex-col flex-grow p-4 md:p-5 gap-3">

          {/* Gem icon accent + name */}
          <div className="flex items-start gap-2">
            <div className="mt-0.5 p-1.5 rounded-lg bg-gradient-to-br from-purple-100 to-pink-100 flex-shrink-0">
              <Gem className="w-3.5 h-3.5 text-purple-500" />
            </div>
            <h3 className="text-sm md:text-base font-bold text-gray-900 leading-snug line-clamp-2 group-hover:text-purple-700 transition-colors duration-300">
              {product.name}
            </h3>
          </div>

          {/* Description — the key addition */}
          <p className="text-xs md:text-sm text-gray-500 leading-relaxed line-clamp-3 flex-grow">
            {product.description}
          </p>

          {/* ── Bottom divider + price echo ─────────────────────────── */}
          <div className="pt-3 border-t border-purple-50 flex items-center justify-between">
            <p className={`text-base font-black bg-gradient-to-r ${ribbon} bg-clip-text text-transparent`}>
              ₱{product.price}
            </p>
            <span className="text-xs text-purple-400 font-semibold tracking-wide uppercase">
              View details →
            </span>
          </div>
        </div>

        {/* ── Bottom shimmer accent on hover ──────────────────────────── */}
        <div className="absolute bottom-0 left-4 right-4 h-px bg-gradient-to-r from-transparent via-purple-300 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      </article>
    </Link>
  );
};

export default ProductCard;