import Link from 'next/link';
import { SiteHeader } from './components/layout/SiteHeader';
import { FlowerMark } from './components/brand/Logo';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />
      <main className="flex-1 flex items-center justify-center px-4 py-20">
        <div className="flex flex-col items-center text-center gap-3 max-w-md animate-fade-up">
          <FlowerMark size={72} />
          <p className="eyebrow mt-2">Page not found</p>
          <h1 className="font-display text-4xl md:text-5xl font-semibold leading-tight">This bead rolled away</h1>
          <p className="text-ink-600">The page you’re looking for doesn’t exist or may have moved.</p>
          <div className="flex flex-wrap justify-center gap-2 mt-4">
            <Link href="/shop" className="btn btn-primary">Back to the shop</Link>
            <Link href="/" className="btn btn-secondary">Home</Link>
          </div>
        </div>
      </main>
    </div>
  );
}
