'use client';

import React, { useState, useEffect, FC } from 'react';
import { ChevronRight, Sparkles, Play } from 'lucide-react';

interface HeroCarouselProps {
  onGoToStore: () => void;
}

const HeroCarousel: FC<HeroCarouselProps> = ({ onGoToStore }) => {
  const images: string[] = [
    '/background/cherry-keychain-forbg.jpg',
    '/background/kynchnbg.jpg',
    '/background/background-image1.jpg',
    '/background/danglingcologo.jpg',
  ];

  const [current, setCurrent] = useState<number>(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % images.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative w-full h-screen overflow-hidden bg-gradient-to-b from-[#faf7e5] to-[#f5e4c0]">
      {/* Carousel Images */}
      {images.map((img, idx) => (
        <div
          key={idx}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            idx === current ? 'opacity-100' : 'opacity-0'
          }`}
          style={{
            backgroundImage: `url(${img})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
      ))}

      {/* Animated Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-black/50" />

      {/* Floating Bead Decorations */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-20 left-10 w-32 h-32 bg-purple-400 rounded-full opacity-20 blur-3xl animate-pulse" />
        <div className="absolute top-40 right-20 w-40 h-40 bg-pink-400 rounded-full opacity-20 blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute bottom-20 left-1/3 w-36 h-36 bg-amber-300 rounded-full opacity-15 blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      {/* Hero Content */}
      <div className="relative z-10 absolute inset-0 flex flex-col items-center justify-center text-center text-white px-4">
        {/* Top Decoration - Animated Beads */}
        <div className="mb-8 flex gap-2 items-center justify-center">
          <div className="w-3 h-3 rounded-full bg-gradient-to-r from-purple-300 to-pink-300 animate-bounce" style={{ animationDelay: '0s' }} />
          <div className="w-3 h-3 rounded-full bg-gradient-to-r from-blue-300 to-cyan-300 animate-bounce" style={{ animationDelay: '0.2s' }} />
          <div className="w-3 h-3 rounded-full bg-gradient-to-r from-amber-300 to-orange-300 animate-bounce" style={{ animationDelay: '0.4s' }} />
        </div>

        {/* Main Icon */}
        <div className="mb-8 relative">
          <div className="absolute -inset-8 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full opacity-30 blur-2xl animate-pulse" />
          <Sparkles className="relative w-16 h-16 md:w-20 md:h-20 text-amber-200 animate-bounce" style={{ animationDelay: '0.1s' }} />
        </div>

        {/* Main Title */}
        <h1 className="text-6xl md:text-8xl font-black mb-4 tracking-wider drop-shadow-lg">
          <span className="bg-gradient-to-r from-amber-200 via-pink-200 to-purple-200 bg-clip-text text-transparent animate-pulse">
            Dangling Co.
          </span>
        </h1>

        {/* Subtitle */}
        <p className="text-xl md:text-3xl font-bold text-white mb-4 drop-shadow-lg">
          ✨ Design Jewelry That's Uniquely Yours ✨
        </p>

        <p className="text-base md:text-lg text-gray-100 mb-12 max-w-2xl font-medium drop-shadow-md">
          Handcrafted beaded jewelry, where every strand tells a story of creativity and passion
        </p>

        {/* CTA Button */}
        <button
          onClick={onGoToStore}
          className="group relative px-8 md:px-12 py-4 md:py-5 font-bold text-lg md:text-xl rounded-full transition-all duration-300 shadow-2xl hover:shadow-3xl hover:scale-110 active:scale-95 border-2 border-white"
        >
          {/* Button Gradient Background */}
          <div className="absolute inset-0 bg-gradient-to-r from-amber-400 via-orange-400 to-rose-400 rounded-full opacity-100 group-hover:opacity-110 transition-opacity" />
          
          {/* Content */}
          <div className="relative flex items-center justify-center gap-2 text-white text-sm">
            <Play className="w-5 h-5 md:w-6 md:h-6 group-hover:scale-110 transition-transform" />
            <span>Explore Collection</span>
            <ChevronRight className="w-5 h-5 md:w-6 md:h-6 group-hover:translate-x-2 transition-transform" />
          </div>
        </button>

        {/* Secondary CTA */}
        <div className="mt-8 text-sm md:text-base text-gray-100">
          <p className="drop-shadow-md">💎 Limited Edition Designs • Fully Customizable 💎</p>
        </div>
      </div>

      {/* Carousel Controls - Bottom */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20 flex items-center gap-6">
        {/* Dot Indicators */}
        <div className="flex gap-2">
          {images.map((_, idx) => (
            <div
              key={idx}
              className={`transition-all duration-300 rounded-full ${
                idx === current
                  ? 'bg-gradient-to-r from-amber-300 to-orange-400 w-8 h-3 shadow-lg'
                  : 'bg-white/50 w-3 h-3'
              }`}
            />
          ))}
        </div>

        {/* Slide Counter */}
        <div className="text-white font-bold text-sm drop-shadow-lg">
          {current + 1} / {images.length}
        </div>
      </div>



      {/* Floating Bead Animation */}
      <style>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-20px) rotate(180deg);
          }
        }

        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default HeroCarousel;