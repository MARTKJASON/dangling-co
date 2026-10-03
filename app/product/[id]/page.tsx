'use client';

import React, { FC, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Check, Heart, Loader2, MessageCircle, PenLine } from 'lucide-react';
import CustomerFeedback from '@/app/components/CustomerFeedback';
import ProductCard from '@/app/components/ProductCard';
import { SiteHeader } from '@/app/components/layout/SiteHeader';
import { SiteFooter } from '@/app/components/layout/SiteFooter';
import { QuantityStepper } from '@/app/components/ui/QuantityStepper';
import { getProductImages } from '@/app/types/product';
import { getCategoryInfo, categorySlug } from '@/app/lib/categories';
import { formatPeso } from '@/app/lib/format';
import { MESSENGER_URL } from '@/app/lib/orderMessage';
import { Product as BasketProduct } from '@/app/lib/products';
import { useAddToBasket, AddPhase } from '@/app/hooks/useAddToBasket';

import { useProductDetails } from './hooks/useProductDetails';
import { ProductImagePanel } from './components/ProductImagePanel';
import { DescriptionBlock } from './components/DescriptionBlock';
import { LoadingScreen, ErrorScreen, NotFoundScreen } from './components/ProductDetailsStateScreens';

const AddButtonLabel: FC<{ phase: AddPhase }> = ({ phase }) => {
  if (phase === 'adding') return <><Loader2 className="w-[18px] h-[18px] animate-spin" aria-hidden /> Adding…</>;
  if (phase === 'added') return <><Check className="w-[18px] h-[18px]" strokeWidth={2.5} aria-hidden /> Added to basket</>;
  return <>Add to basket</>;
};

const ProductDetailsPage: FC = () => {
  const params = useParams();
  const productId = params.id as string;
  const { product, related, loading, error, notFound, retry } = useProductDetails(productId);
  const { add, phase } = useAddToBasket();
  const [quantity, setQuantity] = useState(1);
  const [note, setNote] = useState('');

  if (error) return <ErrorScreen message={error} onRetry={retry} />;
  if (notFound) return <NotFoundScreen />;
  if (loading || !product) return <LoadingScreen />;

  const category = getCategoryInfo(product.category);
  const handleAdd = () => {
    add({ ...product, image: product.image_url } as BasketProduct, note, quantity);
    setNote('');
    setQuantity(1);
  };
  const addClass = `btn btn-lg flex-1 ${phase === 'added' ? 'btn-success' : 'btn-primary'}`;

  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader active="shop" />

      <main className="flex-1 w-full max-w-[1200px] mx-auto px-4 md:px-8 pt-0 md:pt-6 pb-32 md:pb-24 flex flex-col gap-16 md:gap-20">
        <div className="flex flex-col gap-5 md:gap-6">
          <nav aria-label="Breadcrumb" className="hidden md:block text-sm text-ink-600">
            <ol className="flex flex-wrap items-center gap-2">
              <li><Link href="/shop" className="py-1.5 hover:text-ink-900">Shop</Link></li>
              {category && (
                <>
                  <li aria-hidden>/</li>
                  <li><Link href={`/shop?category=${categorySlug(category.id)}`} className="py-1.5 hover:text-ink-900">{category.label}</Link></li>
                </>
              )}
              <li aria-hidden>/</li>
              <li aria-current="page" className="text-ink-900 font-medium">{product.name}</li>
            </ol>
          </nav>

          <div className="flex flex-col md:flex-row gap-6 md:gap-14 items-start">
            <div className="w-full md:flex-[1_1_520px] min-w-0">
              <ProductImagePanel key={product.id} imageUrls={getProductImages(product)} name={product.name} />
            </div>

            <div className="w-full md:flex-[1_1_400px] min-w-0 flex flex-col gap-5 md:gap-6 md:sticky md:top-[100px]">
              <div className="flex flex-col gap-2 md:gap-2.5">
                {category && <span className="eyebrow">{category.label}</span>}
                <h1 className="font-display text-[30px] md:text-[44px] leading-[1.08] font-semibold tracking-[-0.015em]">{product.name}</h1>
                <span className="text-[22px] md:text-[26px] font-bold tabular-nums">{formatPeso(product.price)}</span>
              </div>

              <DescriptionBlock text={product.description} />

              <div className="flex items-start gap-3 px-4 py-3.5 rounded-2xl bg-butter-100 text-[15px]">
                <Heart className="w-5 h-5 mt-0.5 shrink-0 text-butter-800" aria-hidden />
                <span><b>Made to order, by hand.</b> Delivered in 2–5 business days depending on location.</span>
              </div>

              <div className="flex flex-col gap-1.5">
                <label htmlFor="maker-note" className="text-sm font-semibold">
                  Note for the maker <span className="font-normal text-ink-600">(optional)</span>
                </label>
                <textarea
                  id="maker-note"
                  rows={2}
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Colors, letters, size…"
                  className="field resize-y"
                />
              </div>

              {/* Desktop add row; on phones the same controls live in the bottom bar. */}
              <div className="hidden md:flex gap-3 items-center">
                <QuantityStepper value={quantity} onChange={setQuantity} label={product.name} />
                <button type="button" onClick={handleAdd} disabled={phase === 'adding'} className={addClass} aria-live="polite">
                  <AddButtonLabel phase={phase} />
                </button>
              </div>

              <a href={MESSENGER_URL} target="_blank" rel="noopener noreferrer" className="btn btn-ghost !min-h-11 !px-3 -ml-3 self-start">
                <MessageCircle className="w-[18px] h-[18px]" aria-hidden /> Questions? Message us first
              </a>

              <ul className="grid grid-cols-3 gap-3 pt-5 border-t border-cream-300 text-sm text-ink-600">
                <li className="flex flex-col gap-1.5"><Heart className="w-5 h-5 text-peri-600" aria-hidden /><b className="text-ink-900">Handmade</b>Strung one bead at a time</li>
                <li className="flex flex-col gap-1.5"><PenLine className="w-5 h-5 text-peri-600" aria-hidden /><b className="text-ink-900">Customizable</b>Tell us in the note</li>
                <li className="flex flex-col gap-1.5"><MessageCircle className="w-5 h-5 text-peri-600" aria-hidden /><b className="text-ink-900">Confirmed on chat</b>We check details with you</li>
              </ul>
            </div>
          </div>
        </div>

        {related.length > 0 && (
          <section className="flex flex-col gap-6">
            <h2 className="font-display text-2xl md:text-[32px] leading-tight font-semibold">You might also like</h2>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-3 gap-y-5 sm:gap-5">
              {related.map((p) => <ProductCard key={p.id} product={p} />)}
            </div>
          </section>
        )}

        <section className="flex flex-col gap-6">
          <h2 className="font-display text-2xl md:text-[32px] leading-tight font-semibold">What customers say</h2>
          <CustomerFeedback />
        </section>
      </main>

      <SiteFooter />

      {/* Phone action bar */}
      <div className="md:hidden fixed inset-x-0 bottom-0 z-20 bg-white border-t border-cream-300 shadow-[0_-8px_20px_-8px_rgb(31_35_64/0.18)] px-4 pt-3 pb-[max(12px,env(safe-area-inset-bottom))] flex gap-2.5 items-center">
        <QuantityStepper value={quantity} onChange={setQuantity} label={product.name} />
        <button type="button" onClick={handleAdd} disabled={phase === 'adding'} className={addClass}>
          <AddButtonLabel phase={phase} />
        </button>
      </div>
    </div>
  );
};

export default ProductDetailsPage;
