'use client';

import React, { FC, useState } from 'react';
import Link from 'next/link';
import { useParams, useSearchParams } from 'next/navigation';
import { ArrowLeft, MessageCircle, Sparkles, Check, ChevronLeft, ChevronRight, Star, Loader } from 'lucide-react';
import { products } from '@/app/lib/products';
import CustomerFeedbackCarousel from '@/app/components/CustomerFeedback';
import { useRouter } from 'next/navigation';
import ChatWidget from '@/app/components/ChatWidget';


const MESSENGER_LINK = 'https://www.messenger.com/t/696684716864112';

// Category colors matching theme
const categoryColors: Record<string, { gradient: string; bg: string; text: string }> = {
  necklace: { gradient: 'from-purple-400 to-pink-300', bg: 'bg-purple-100', text: 'text-purple-700' },
  bracelet: { gradient: 'from-blue-400 to-cyan-300', bg: 'bg-blue-100', text: 'text-blue-700' },
  keychain: { gradient: 'from-amber-400 to-orange-300', bg: 'bg-amber-100', text: 'text-amber-700' },
  anklet: { gradient: 'from-rose-400 to-red-300', bg: 'bg-rose-100', text: 'text-rose-700' },
  magnet: { gradient: 'from-green-400 to-emerald-300', bg: 'bg-green-100', text: 'text-green-700' },
};

const categoryEmojis: Record<string, string> = {
  necklace: '✨',
  bracelet: '🌀',
  keychain: '🔑',
  anklet: '💫',
  magnet: '🧲',
};

// Customer Feedback Types
interface Feedback {
  id: number;
  image: string;
  customerName: string;
  rating: number;
  text: string;
}


const ProductDetailsPage: FC = () => {
    const chatParams = useSearchParams();
  const token = chatParams.get('token') as string;
  const params = useParams();
  const productId = Number(params.id);
  const [isMessageSent, setIsMessageSent] = useState(false);
  const router = useRouter();
  const handleMessageOrder = (
    productName: string,
    productPrice: string,
    productImage: string
  ) => {
    const inquiryMessage = `
Hi! I'm interested in ordering the "${productName}" (${productPrice}).

📸 Image: ${productImage}

Could you please provide more details about customization options and delivery time? Thank you!
`;

    const encodedMessage = encodeURIComponent(inquiryMessage);
    const messengerAppLink = `fb-messenger://user-thread/696684716864112?text=${encodedMessage}`;
    const messengerWebLink = `https://www.messenger.com/t/696684716864112?text=${encodedMessage}`;

    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

    if (isMobile) {
      window.location.href = messengerAppLink;
      setTimeout(() => {
        window.open(messengerWebLink, '_blank');
      }, 500);
    } else {
      window.open(messengerWebLink, '_blank');
    }

    setIsMessageSent(true);
    setTimeout(() => setIsMessageSent(false), 2000);
  };

  let product = null;
  let categoryColor = null;
  let categoryEmoji = null;

  for (const category of Object.keys(products)) {
    const found = (products as any)[category].find((p: any) => p.id === productId);
    if (found) {
      product = found;
      categoryColor = categoryColors[category] || categoryColors.necklace;
      categoryEmoji = categoryEmojis[category] || '✨';
      break;
    }
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#faf7e5] to-[#f5e4c0] flex items-center justify-center">
        <div className="text-center px-4">
          <div className="text-6xl mb-4">🧿</div>
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
            Bead not found
          </h1>
          <p className="text-gray-600 mb-8 max-w-md">
            This beautiful piece seems to have rolled away. Let's get you back to our collection!
          </p>
          <button
            onClick={() => router.push('/store')}
            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-amber-400 to-orange-400 hover:from-amber-500 hover:to-orange-500 text-white font-bold rounded-full transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Collection
          </button>
        </div>
      </div>
    );
  }


  return (
    <div className="min-h-screen bg-gradient-to-b from-[#faf7e5] via-[#f5e4c0] to-[#f0d9b5]">
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-20 left-10 w-40 h-40 bg-purple-300 rounded-full opacity-20 blur-3xl animate-pulse" />
        <div className="absolute bottom-40 right-10 w-48 h-48 bg-blue-300 rounded-full opacity-15 blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      <div className="sticky top-0 z-40 backdrop-blur-lg bg-white/90 border-b-2 border-gray-100 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-4">
          <button
            onClick={() => router.push('/store')}
            className="inline-flex items-center gap-2 px-4 py-2 text-purple-600 hover:text-purple-800 font-bold transition-all duration-300 hover:gap-3 group"
          >
            <ArrowLeft className="w-5 h-5 group-hover:scale-110 transition-transform" />
            Back to Collection
          </button>
        </div>
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 md:px-6 py-8 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 lg:gap-16">
          <div className="flex items-center justify-center">
            <div className="relative w-full">
              <div className="absolute -inset-4 bg-gradient-to-r from-purple-400 to-pink-300 rounded-3xl opacity-20 blur-2xl" />
              <div className="relative w-full bg-white rounded-3xl overflow-hidden shadow-2xl border-2 border-white">
                <div className="aspect-square overflow-hidden">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col justify-center space-y-6">
            <div className="flex items-center gap-3">
              <span className="text-3xl">{categoryEmoji}</span>
              <div className={`inline-block px-4 py-2 ${categoryColor?.bg} ${categoryColor?.text} font-bold rounded-full`}>
                {product.category.charAt(0).toUpperCase() + product.category.slice(1)}
              </div>
            </div>

            <div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-gray-900 via-purple-700 to-pink-600 bg-clip-text text-transparent mb-4 leading-tight">
                {product.name}
              </h1>
            </div>

            <p className="text-lg md:text-xl text-gray-700 leading-relaxed font-medium">
              {product.description}
            </p>

            <div className="py-6 px-6 md:px-8 bg-gradient-to-r from-amber-100 to-orange-100 rounded-2xl border-2 border-amber-200">
              <p className="text-sm font-semibold text-gray-600 mb-2">Price</p>
              <p className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
                {product.price}
              </p>
            </div>

            <div className="space-y-4 py-6 border-y-2 border-gray-300">
              <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <Sparkles className="w-6 h-6 text-amber-500" />
                Why Choose This Bead?
              </h3>
              <ul className="space-y-3">
                {[
                  'Handcrafted with love & attention to detail',
                  'Premium quality beads & materials',
                  'Fully customizable to your style',
                  'Perfect gift for someone special',
                  'Made to order with care',
                ].map((detail, index) => (
                  <li key={index} className="flex items-center gap-3">
                    <div className={`flex-shrink-0 w-2 h-2 rounded-full bg-gradient-to-r ${categoryColor?.gradient || 'from-purple-400 to-pink-300'}`} />
                    <span className="text-gray-700 font-medium">{detail}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-3 pt-4">
              <button
                onClick={() =>
                  handleMessageOrder(product.name, product.price, product.image)
                }
                className={`w-full flex items-center justify-center gap-3 px-8 py-4 font-bold rounded-full transition-all duration-300 shadow-lg text-lg group ${
                  isMessageSent
                    ? 'bg-green-500 text-white'
                    : `bg-gradient-to-r ${categoryColor?.gradient || 'from-purple-400 to-pink-300'} text-white hover:shadow-2xl hover:scale-105`
                }`}
              >
                {isMessageSent ? (
                  <>
                    <Loader className="w-6 h-6 animate-bounce" />
                    Redirecting to Messenger
                  </>
                ) : (
                  <>
                    <MessageCircle className="w-6 h-6 group-hover:scale-110 transition-transform" />
                    Message Us to Order
                  </>
                )}
              </button>

              <div className="p-5 rounded-2xl bg-gradient-to-r from-blue-50 to-cyan-50 border-2 border-blue-200">
                <p className="text-sm md:text-base text-gray-700 font-medium flex items-start gap-3">
                  <span className="text-2xl mt-1">💎</span>
                  <span>
                    Each piece is <strong>one-of-a-kind</strong> and made to order. 
                    <br />
                    <strong>Estimated delivery:</strong> 2-5 business days depends on location.
                  </span>
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-3 pt-4">
              {[
                { emoji: '🎨', label: 'Customizable' },
                { emoji: '✋', label: 'Handmade' },
                { emoji: '🌟', label: 'Premium' },
              ].map((badge, index) => (
                <div key={index} className="px-4 py-2 bg-white rounded-full border-2 border-gray-200 font-bold text-gray-700 flex items-center gap-2">
                  <span className="text-xl">{badge.emoji}</span>
                  {badge.label}
                </div>
              ))}
            </div>
                      {product && (
        <ChatWidget
          productName={product.name}
          productPrice={product.price}
          productImage={product.image}
        />
        
      )}

          </div>

        </div>
        {/* Customer Feedback Carousel */}
        <div className="mt-20 pt-20 border-t-4 border-gray-200">
          <CustomerFeedbackCarousel />
        </div>
      </div>
    </div>
  );
};

export default ProductDetailsPage;