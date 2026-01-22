'use client';

import { useRouter } from 'next/navigation';
import HeroCarousel from '../components/HeroCarousel';

export default function HomePage() {
  const router = useRouter();

  return (
   <> 
   <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50 flex flex-col items-center justify-center px-4">
          <h1 className="text-4xl md:text-5xl font-light text-gray-900 mb-4 text-center">
            Design Your Jewelry
          </h1>
          <p className="text-lg text-gray-600 mb-8 text-center max-w-md">
            Customization flow coming soon. Get ready to create something uniquely yours!
          </p>
          <button
            onClick={() => router.push('/store')}
            className="px-6 py-3 bg-amber-500 hover:bg-amber-600 text-white font-medium rounded-lg transition-all"
          >
            Back to Store
          </button>
        </div>
   
   </>

)
}
