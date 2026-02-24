'use client';

import React, { FC } from 'react';
import { useParams } from 'next/navigation';
import CustomerFeedbackCarousel from '@/app/components/CustomerFeedback';

import { useProductDetails } from './hooks/useProductDetails';
import { ProductDetailsNav } from './components/ProductDetailsNav';
import { ProductImagePanel } from './components/ProductImagePanel';
import { DescriptionBlock } from './components/DescriptionBlock';
import { WhyLoveIt } from './components/WhyLoveIt';
import { ProductCTA } from './components/ProductCTA';
import {
  LoadingScreen,
  ErrorScreen,
  NotFoundScreen,
} from './components/ProductDetailsStateScreens';
import { AddToOrderButton } from './components/AddtoOrderButton';
import { OrderListFAB } from '@/app/components/OrderListFAB';

const ProductDetailsPage: FC = () => {
  const params = useParams();
  const productId = params.id as string;

  const { product, color, emoji, loading, error, isMessageSent, handleMessageOrder } =
    useProductDetails(productId);

  if (loading) return <LoadingScreen />;
  if (error) return <ErrorScreen message={error} />;
  if (!product) return <NotFoundScreen />;

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#faf7e5] via-[#f5e4c0] to-[#f0d9b5]">

      {/* Ambient blobs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-20 left-10 w-56 h-56 bg-purple-300 rounded-full opacity-20 blur-3xl animate-pulse" />
        <div className="absolute bottom-40 right-10 w-64 h-64 bg-pink-300 rounded-full opacity-15 blur-3xl animate-pulse" style={{ animationDelay: '1.2s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 w-96 h-32 bg-amber-200 rounded-full opacity-10 blur-3xl" />
      </div>

      <ProductDetailsNav category={product.category} emoji={emoji} color={color} />

      <div className="relative z-10 max-w-6xl mx-auto px-4 md:px-6 py-10 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 lg:gap-20">

          {/* Left — image */}
          <ProductImagePanel
            imageUrl={product.image_url}
            name={product.name}
            price={product.price}
            color={color}
          />

          {/* Right — details */}
          <div className="flex flex-col gap-7">
            <AddToOrderButton product={product} />
            {/* Category tag */}
            <div className={`inline-flex items-center gap-2 self-start px-4 py-2 rounded-full ${color.bg} ${color.text} border ${color.border} font-semibold text-sm`}>
              <span className="text-lg">{emoji}</span>
              {product.category.charAt(0).toUpperCase() + product.category.slice(1)}
            </div>

            {/* Title */}
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold bg-gradient-to-r from-gray-900 via-purple-700 to-pink-600 bg-clip-text text-transparent leading-tight">
              {product.name}
            </h1>

            <DescriptionBlock text={product.description} color={color} />

            {/* Price box */}
            <div className="px-6 py-5 bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl border-2 border-amber-200 shadow-sm">
              <p className="text-xs font-bold uppercase tracking-widest text-amber-500 mb-1">Price</p>
              <p className="text-5xl font-black bg-gradient-to-r from-amber-600 to-orange-500 bg-clip-text text-transparent">
                ₱{product.price}
              </p>
            </div>

            <WhyLoveIt color={color} />

          </div>
        </div>
        <OrderListFAB />
        {/* Customer feedback */}
        <div className="mt-24 pt-16 border-t-2 border-amber-200/60">
          <CustomerFeedbackCarousel />
        </div>
      </div>

    </div>
  );
};

export default ProductDetailsPage;