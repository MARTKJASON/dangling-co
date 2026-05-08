'use client';

import React, { FC, useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, Gem, Palette } from 'lucide-react';
import { CategoryColor } from '../categoryConfig';

interface ProductImagePanelProps {
  imageUrls: string[];
  name: string;
  price: string;
  color: CategoryColor;
}

const SWIPE_THRESHOLD = 40;

export const ProductImagePanel: FC<ProductImagePanelProps> = ({ imageUrls, name, price, color }) => {
  const images = imageUrls.length > 0 ? imageUrls : [''];
  const hasMultiple = images.length > 1;

  const [current, setCurrent] = useState(0);
  const touchStartX = useRef<number | null>(null);
  const thumbsRef = useRef<HTMLDivElement>(null);

  const goTo = (idx: number) => {
    const next = ((idx % images.length) + images.length) % images.length;
    setCurrent(next);
  };
  const next = () => goTo(current + 1);
  const prev = () => goTo(current - 1);

  // Reset to first image whenever the product images change (e.g. navigation)
  useEffect(() => { setCurrent(0); }, [imageUrls]);

  // Keyboard arrows
  useEffect(() => {
    if (!hasMultiple) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') prev();
      if (e.key === 'ArrowRight') next();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [hasMultiple, current]);

  // Keep the active thumbnail in view on mobile
  useEffect(() => {
    const el = thumbsRef.current?.children[current] as HTMLElement | undefined;
    el?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
  }, [current]);

  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current == null) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(dx) > SWIPE_THRESHOLD) (dx < 0 ? next : prev)();
    touchStartX.current = null;
  };

  return (
    <div className="flex items-start justify-center">
      <div className="relative w-full max-w-md">
        {/* Glow halo */}
        <div className={`absolute -inset-4 bg-gradient-to-r ${color.gradient} rounded-3xl opacity-20 blur-2xl`} />

        {/* Image card */}
        <div
          className="relative bg-white rounded-3xl overflow-hidden shadow-2xl border-2 border-white"
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
        >
          <div className="relative aspect-square overflow-hidden">
            {images.map((src, idx) => (
              <img
                key={`${src}-${idx}`}
                src={src}
                alt={`${name} — image ${idx + 1} of ${images.length}`}
                className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${
                  idx === current ? 'opacity-100' : 'opacity-0 pointer-events-none'
                } ${idx === current ? 'hover:scale-105' : ''} transition-transform`}
                draggable={false}
              />
            ))}

            {hasMultiple && (
              <>
                <button
                  type="button"
                  onClick={prev}
                  aria-label="Previous image"
                  className="absolute top-1/2 left-3 -translate-y-1/2 w-10 h-10 rounded-full bg-white/85 hover:bg-white shadow-md backdrop-blur flex items-center justify-center text-gray-800 transition-all hover:scale-105 active:scale-95"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  type="button"
                  onClick={next}
                  aria-label="Next image"
                  className="absolute top-1/2 right-3 -translate-y-1/2 w-10 h-10 rounded-full bg-white/85 hover:bg-white shadow-md backdrop-blur flex items-center justify-center text-gray-800 transition-all hover:scale-105 active:scale-95"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>

                {/* Counter */}
                <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-black/55 backdrop-blur text-white text-xs font-semibold">
                  {current + 1} / {images.length}
                </div>

                {/* Dots */}
                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5">
                  {images.map((_, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => goTo(idx)}
                      aria-label={`Go to image ${idx + 1}`}
                      className={`transition-all duration-300 rounded-full ${
                        idx === current
                          ? `w-6 h-2 bg-gradient-to-r ${color.gradient} shadow`
                          : 'w-2 h-2 bg-white/70 hover:bg-white'
                      }`}
                    />
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Price badge overlaid on image */}
          <div className="absolute bottom-4 left-4">
            <div className={`px-4 py-2 bg-gradient-to-r ${color.gradient} rounded-full shadow-lg`}>
              <p className="text-white font-black text-lg tracking-wide">₱{price}</p>
            </div>
          </div>
        </div>

        {/* Thumbnail strip */}
        {hasMultiple && (
          <div
            ref={thumbsRef}
            className="mt-4 flex gap-2 overflow-x-auto scroll-smooth pb-1 -mx-1 px-1"
          >
            {images.map((src, idx) => (
              <button
                key={`thumb-${src}-${idx}`}
                type="button"
                onClick={() => goTo(idx)}
                aria-label={`Show image ${idx + 1}`}
                className={`relative shrink-0 w-16 h-16 rounded-xl overflow-hidden border-2 transition-all ${
                  idx === current
                    ? `${color.border} ring-2 ring-offset-2 ring-offset-transparent`
                    : 'border-white/80 opacity-70 hover:opacity-100'
                }`}
                style={idx === current ? { boxShadow: '0 4px 12px rgba(0,0,0,0.15)' } : undefined}
              >
                <img src={src} alt="" className="w-full h-full object-cover" draggable={false} />
              </button>
            ))}
          </div>
        )}

        {/* Floating badges below image */}
        <div className="flex justify-center gap-3 mt-5 flex-wrap">
          {[
            { icon: <Palette className="w-4 h-4" />, label: 'Customizable' },
            { icon: '✋', label: 'Handmade' },
            { icon: <Gem className="w-4 h-4" />, label: 'Premium' },
          ].map((badge, i) => (
            <div
              key={i}
              className="flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full border border-amber-200 shadow-sm text-sm font-semibold text-gray-700"
            >
              <span className={typeof badge.icon === 'string' ? 'text-base' : color.text}>
                {badge.icon}
              </span>
              {badge.label}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
