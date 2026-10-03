import Link from 'next/link';
import { MessageCircle } from 'lucide-react';
import { SiteHeader } from '../components/layout/SiteHeader';
import { FlowerMark } from '../components/brand/Logo';
import { MESSENGER_URL } from '../lib/orderMessage';

// The customizer isn't built yet, so nothing links here; this page is a friendly
// placeholder for anyone who has the old URL.
export default function CustomizePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />
      <main className="flex-1 flex items-center justify-center px-4 py-20">
        <div className="flex flex-col items-center text-center gap-3 max-w-md animate-fade-up">
          <FlowerMark size={72} />
          <h1 className="font-display text-4xl font-semibold leading-tight mt-2">Design your own, soon</h1>
          <p className="text-ink-600">
            We’re building a way to design your piece here. Until then, message us what you’re picturing and we’ll make it.
          </p>
          <div className="flex flex-wrap justify-center gap-2 mt-4">
            <a href={MESSENGER_URL} target="_blank" rel="noopener noreferrer" className="btn btn-primary">
              <MessageCircle className="w-[18px] h-[18px]" aria-hidden /> Message us
            </a>
            <Link href="/shop" className="btn btn-secondary">Browse the shop</Link>
          </div>
        </div>
      </main>
    </div>
  );
}
