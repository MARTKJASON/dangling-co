import Link from 'next/link';
import Image from 'next/image';
import React, { FC } from 'react';
import { getCategoryInfo } from '../lib/categories';
import { formatPeso } from '../lib/format';

interface ProductCardProduct {
  id: string;
  name: string;
  price: string;
  image_url: string;
  category?: string;
}

interface ProductCardProps {
  product: ProductCardProduct;
  /** Pass true for the first row so the browser loads those images first. */
  priority?: boolean;
}

/** The whole card is the link. One price, in ink; the photo leads. */
const ProductCard: FC<ProductCardProps> = ({ product, priority = false }) => {
  const category = product.category ? getCategoryInfo(product.category) : undefined;

  return (
    <Link
      href={`/product/${product.id}`}
      className="group flex flex-col h-full bg-white rounded-card overflow-hidden shadow-rest ring-1 ring-inset ring-cream-200
        transition-[transform,box-shadow] duration-200 ease-soft hover:-translate-y-[3px] hover:shadow-raised"
    >
      <div className="relative aspect-[4/5] overflow-hidden bg-cream-200">
        <Image
          src={product.image_url}
          alt={product.name}
          fill
          priority={priority}
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          className="object-cover transition-transform duration-500 ease-soft group-hover:scale-[1.03]"
        />
      </div>
      <div className="flex flex-col gap-1 px-3 pt-3 pb-4 sm:px-4 sm:pt-3.5">
        {category && <span className="eyebrow hidden sm:block">{category.singular}</span>}
        <h3 className="font-display text-base sm:text-[19px] leading-tight font-semibold line-clamp-2">{product.name}</h3>
        <span className="mt-0.5 sm:mt-1 text-[15px] sm:text-[17px] font-bold tabular-nums">{formatPeso(product.price)}</span>
      </div>
    </Link>
  );
};

export const ProductCardSkeleton: FC = () => (
  <div className="flex flex-col gap-2" aria-hidden>
    <div className="skeleton aspect-[4/5] rounded-card" />
    <div className="skeleton h-3.5 w-3/4 rounded-full" />
    <div className="skeleton h-3.5 w-1/3 rounded-full" />
  </div>
);

export default ProductCard;
