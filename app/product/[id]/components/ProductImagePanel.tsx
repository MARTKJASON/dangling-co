'use client';

import React, { FC, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface ProductImagePanelProps {
  imageUrls: string[];
  name: string;
}

const SWIPE_THRESHOLD = 40;

/**
 * Gallery: thumbnails beside the photo on desktop; swipe + dots on phones.
 * Render it with key={product.id} so it starts at the first photo for each product.
 */
export const ProductImagePanel: FC<ProductImagePanelProps> = ({ imageUrls, name }) => {
  const images = imageUrls.length > 0 ? imageUrls : [''];
  const hasMultiple = images.length > 1;
  const [current, setCurrent] = useState(0);
  const touchStartX = useRef<number | null>(null);

  const goTo = (idx: number) => setCurrent(((idx % images.length) + images.length) % images.length);

  const onTouchStart = (e: React.TouchEvent) => { touchStartX.current = e.touches[0].clientX; };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current == null) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(dx) > SWIPE_THRESHOLD) goTo(current + (dx < 0 ? 1 : -1));
    touchStartX.current = null;
  };

  // Arrow keys work only while focus is inside the gallery, not page-wide.
  const onKeyDown = (e: React.KeyboardEvent) => {
    if (!hasMultiple) return;
    if (e.key === 'ArrowLeft') { e.preventDefault(); goTo(current - 1); }
    if (e.key === 'ArrowRight') { e.preventDefault(); goTo(current + 1); }
  };

  return (
    <div className="flex flex-col md:flex-row-reverse gap-4" onKeyDown={onKeyDown}>
      <div
        className="relative flex-1 aspect-[4/5] -mx-4 md:mx-0 md:rounded-[28px] overflow-hidden bg-cream-200 group"
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
        aria-roledescription="carousel"
        aria-label={`${name} photos`}
      >
        {images.map((src, idx) =>
          src ? (
            <img
              key={`${src}-${idx}`}
              src={src}
              alt={`${name}, photo ${idx + 1} of ${images.length}`}
              aria-hidden={idx !== current}
              draggable={false}
              className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ease-soft ${
                idx === current ? 'opacity-100' : 'opacity-0 pointer-events-none'
              }`}
            />
          ) : null,
        )}

        {hasMultiple && (
          <>
            <button type="button" onClick={() => goTo(current - 1)} aria-label="Previous photo"
              className="icon-btn !absolute left-3 top-1/2 -translate-y-1/2 bg-white/90 shadow-rest hover:!bg-white hidden md:inline-flex opacity-0 group-hover:opacity-100 focus-visible:opacity-100 transition-opacity">
              <ChevronLeft className="w-5 h-5" aria-hidden />
            </button>
            <button type="button" onClick={() => goTo(current + 1)} aria-label="Next photo"
              className="icon-btn !absolute right-3 top-1/2 -translate-y-1/2 bg-white/90 shadow-rest hover:!bg-white hidden md:inline-flex opacity-0 group-hover:opacity-100 focus-visible:opacity-100 transition-opacity">
              <ChevronRight className="w-5 h-5" aria-hidden />
            </button>
            <span className="absolute right-4 bottom-4 px-3 py-1.5 rounded-full bg-ink-900/70 text-white text-[13px] font-semibold tabular-nums hidden md:block">
              {current + 1} / {images.length}
            </span>
            <div className="absolute inset-x-0 bottom-3.5 flex justify-center gap-1.5 md:hidden" aria-hidden>
              {images.map((_, idx) => (
                <span key={idx} className={`h-1.5 rounded-full transition-all duration-200 ${idx === current ? 'w-5 bg-white' : 'w-1.5 bg-white/60'}`} />
              ))}
            </div>
          </>
        )}
      </div>

      {hasMultiple && (
        <div className="hidden md:flex flex-col gap-3" role="group" aria-label="Choose a photo">
          {images.map((src, idx) => (
            <button
              key={`thumb-${src}-${idx}`}
              type="button"
              onClick={() => goTo(idx)}
              aria-label={`Show photo ${idx + 1} of ${images.length}`}
              aria-pressed={idx === current}
              className={`w-[76px] h-[92px] rounded-[14px] overflow-hidden bg-cream-200 transition-[opacity,box-shadow] duration-200 ${
                idx === current
                  ? 'opacity-100 shadow-[0_0_0_2px_var(--color-cream-100),0_0_0_4px_var(--color-peri-600)]'
                  : 'opacity-75 hover:opacity-100 ring-1 ring-inset ring-cream-300'
              }`}
            >
              <img src={src} alt="" className="w-full h-full object-cover" draggable={false} />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
