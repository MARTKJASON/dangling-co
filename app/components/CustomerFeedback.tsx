import React, { FC } from 'react';
import Image from 'next/image';
import { Star } from 'lucide-react';

interface Feedback {
  id: number;
  image: string;
  rating: number;
  text: string;
}

const FEEDBACKS: Feedback[] = [
  {
    id: 1,
    image: '/customer-feedback/feedback01.jpg',
    rating: 5,
    text: 'Absolutely beautiful! The quality is amazing and my customized piece arrived perfectly. Highly recommend!',
  },
  {
    id: 2,
    image: '/customer-feedback/feedback02.jpg',
    rating: 5,
    text: 'Love the handcrafted quality! Every detail is perfect. This will definitely be my go-to for gifts!',
  },
  {
    id: 3,
    image: '/customer-feedback/feedback03.jpg',
    rating: 5,
    text: 'Best purchase ever! The colors are vibrant and the craftsmanship is outstanding. Worth every peso!',
  },
];

/** Customer feedback: a static grid on desktop, a swipeable row on phones. No autoplay. */
const CustomerFeedback: FC = () => (
  <ul className="flex md:grid md:grid-cols-3 gap-4 md:gap-5 overflow-x-auto no-scrollbar snap-x snap-mandatory -mx-4 px-4 md:mx-0 md:px-0">
    {FEEDBACKS.map((f) => (
      <li key={f.id} className="snap-start shrink-0 w-[82%] sm:w-[60%] md:w-auto bg-white rounded-card ring-1 ring-inset ring-cream-300 overflow-hidden flex flex-col">
        <div className="relative aspect-[4/3] bg-cream-200">
          <Image src={f.image} alt="Customer photo of their order" fill sizes="(max-width: 768px) 82vw, 380px" className="object-cover" />
        </div>
        <figure className="p-5 md:p-6 flex flex-col gap-3">
          <div className="flex gap-0.5" aria-label={`${f.rating} out of 5 stars`} role="img">
            {Array.from({ length: f.rating }).map((_, i) => (
              <Star key={i} className="w-[18px] h-[18px] fill-butter-400 text-butter-400" aria-hidden />
            ))}
          </div>
          <blockquote className="text-[16px] leading-relaxed text-ink-900">“{f.text}”</blockquote>
        </figure>
      </li>
    ))}
  </ul>
);

export default CustomerFeedback;
