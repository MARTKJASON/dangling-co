import React, { FC, useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Star } from 'lucide-react';

interface Feedback {
  id: number;
  image: string;
  rating: number;
  text: string;
}

const CustomerFeedbackCarousel: FC = () => {
  const [current, setCurrent] = useState<number>(0);
  const [autoPlay, setAutoPlay] = useState<boolean>(true);

  const feedbacks: Feedback[] = [
    {
      id: 1,
      image: '/customer-feedback/feedback01.jpg',
      rating: 5,
      text: 'Absolutely beautiful! The quality is amazing and my customized piece arrived perfectly. Highly recommend! 💖',
    },
    {
      id: 2,
      image: '/customer-feedback/feedback02.jpg',
      rating: 5,
      text: 'Love the handcrafted quality! Every detail is perfect. This will definitely be my go-to for gifts! ✨',
    },
    {
      id: 3,
      image: '/customer-feedback/feedback03.jpg',
      rating: 5,
      text: 'Best purchase ever! The colors are vibrant and the craftsmanship is outstanding. Worth every peso! 🌟',
    },
  ];

  useEffect(() => {
    if (!autoPlay) return;

    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % feedbacks.length);
    }, 6000);

    return () => clearInterval(timer);
  }, [autoPlay, feedbacks.length]);

  const nextSlide = () => {
    setCurrent((prev) => (prev + 1) % feedbacks.length);
    setAutoPlay(false);
    setTimeout(() => setAutoPlay(true), 8000);
  };

  const prevSlide = () => {
    setCurrent((prev) => (prev - 1 + feedbacks.length) % feedbacks.length);
    setAutoPlay(false);
    setTimeout(() => setAutoPlay(true), 8000);
  };

  const goToSlide = (index: number) => {
    setCurrent(index);
    setAutoPlay(false);
    setTimeout(() => setAutoPlay(true), 8000);
  };

  return (
    <div className="w-full py-12 md:py-20 px-4 md:px-0">
      {/* Section Title */}
      <div className="max-w-6xl mx-auto mb-12 text-center">
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="w-2 h-2 rounded-full bg-gradient-to-r from-purple-400 to-pink-400" />
          <h2 className="text-3xl md:text-5xl font-bold bg-gradient-to-r from-purple-600 via-pink-500 to-rose-500 bg-clip-text text-transparent">
            Customer Love 💝
          </h2>
          <div className="w-2 h-2 rounded-full bg-gradient-to-r from-pink-400 to-rose-400" />
        </div>
        <p className="text-gray-600 font-medium text-lg">
          See what our happy customers are saying about their beaded treasures
        </p>
      </div>

      {/* Carousel Container */}
      <div className="max-w-4xl mx-auto relative">
        {/* Feedback Cards */}
        <div className="relative h-96 md:h-80">
          {feedbacks.map((feedback, idx) => (
            <div
              key={feedback.id}
              className={`absolute inset-0 transition-all duration-700 ${
                idx === current ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'
              }`}
            >
              <div className="h-full bg-white rounded-3xl shadow-2xl border-2 border-gray-100 overflow-hidden flex flex-col md:flex-row">
                {/* Feedback Image */}
                <div className="relative w-full md:w-2/5 h-48 md:h-full overflow-hidden">
                  <img
                    src={feedback.image}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent to-white opacity-10" />
                </div>

                {/* Feedback Content */}
                <div className="relative flex-1 p-6 md:p-8 flex flex-col justify-between bg-gradient-to-br from-white via-purple-50/30 to-pink-50/30">
                  {/* Decorative element */}
                  <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-purple-200 to-pink-200 rounded-full opacity-20 blur-2xl" />

                  {/* Stars */}
                  <div className="flex gap-1 mb-4">
                    {Array.from({ length: feedback.rating }).map((_, i) => (
                      <Star
                        key={i}
                        className="w-5 h-5 fill-amber-400 text-amber-400 animate-pulse"
                        style={{ animationDelay: `${i * 0.1}s` }}
                      />
                    ))}
                  </div>

                  {/* Feedback Text */}
                  <div className="mb-6">
                    <p className="text-gray-700 font-medium text-base md:text-lg leading-relaxed italic mb-4">
                      "{feedback.text}"
                    </p>
                  </div>


                  {/* Quotation Mark Decoration */}
                  <div className="absolute top-6 right-8 text-6xl text-purple-200 opacity-40 font-serif">
                    "
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Navigation Arrows */}
        <button
          onClick={prevSlide}
          className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-6 md:-translate-x-16 group z-20 p-3 bg-white hover:bg-gradient-to-r hover:from-purple-400 hover:to-pink-400 rounded-full transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-110 active:scale-95 border-2 border-gray-200 hover:border-transparent"
          aria-label="Previous feedback"
        >
          <ChevronLeft className="w-6 h-6 text-gray-700 group-hover:text-white transition-colors" />
        </button>

        <button
          onClick={nextSlide}
          className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-6 md:translate-x-16 group z-20 p-3 bg-white hover:bg-gradient-to-r hover:from-purple-400 hover:to-pink-400 rounded-full transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-110 active:scale-95 border-2 border-gray-200 hover:border-transparent"
          aria-label="Next feedback"
        >
          <ChevronRight className="w-6 h-6 text-gray-700 group-hover:text-white transition-colors" />
        </button>

        {/* Dot Indicators */}
        <div className="flex gap-3 justify-center mt-8">
          {feedbacks.map((_, idx) => (
            <button
              key={idx}
              onClick={() => goToSlide(idx)}
              className={`transition-all duration-300 rounded-full ${
                idx === current
                  ? 'bg-gradient-to-r from-purple-400 to-pink-400 w-8 h-3 shadow-lg'
                  : 'bg-gray-300 hover:bg-gray-400 w-3 h-3'
              }`}
              aria-label={`Go to feedback ${idx + 1}`}
            />
          ))}
        </div>

        {/* Slide Counter */}
        <div className="text-center mt-6 text-gray-600 font-semibold">
          {current + 1} / {feedbacks.length}
        </div>
      </div>

    </div>
  );
};

export default CustomerFeedbackCarousel;