import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Heart, MessageCircle, PenLine, Truck } from 'lucide-react';
import { SiteHeader } from './components/layout/SiteHeader';
import { SiteFooter } from './components/layout/SiteFooter';
import { FlowerMark } from './components/brand/Logo';
import { RecentProducts } from './components/home/RecentProducts';
import CustomerFeedback from './components/CustomerFeedback';
import { MESSENGER_URL } from './lib/orderMessage';
import { categorySlug } from './lib/categories';
import type { Category } from './lib/products';

const CATEGORY_TILES: { id: Category; label: string; image?: string }[] = [
  { id: 'keychain', label: 'Keychains', image: '/product-images/danglingco/sunflowerkychn.jpg' },
  { id: 'necklace', label: 'Necklaces', image: '/product-images/danglingco/necklace1.jpg' },
  { id: 'bracelet / anklet', label: 'Bracelets & anklets', image: '/product-images/danglingco/bracelet.jpg' },
  { id: 'magnet', label: 'Magnets' },
];

const STEPS = [
  { title: 'Fill your basket', body: 'Pick your pieces and add a note with colors, letters or sizes.' },
  { title: 'Send it on Messenger', body: 'We write the order message for you. Paste it, hit send, and we confirm the details together.' },
  { title: 'We make it by hand', body: 'Your piece is strung to order and delivered in 2–5 business days, depending on location.' },
];

const SectionHeading = ({ children, action }: { children: React.ReactNode; action?: React.ReactNode }) => (
  <div className="flex items-end justify-between gap-4 flex-wrap">
    <h2 className="font-display text-[30px] md:text-[40px] leading-[1.1] font-semibold">{children}</h2>
    {action}
  </div>
);

const SeeAll = ({ href, children }: { href: string; children: React.ReactNode }) => (
  <Link href={href} className="inline-flex items-center gap-1.5 py-2.5 font-semibold text-peri-700 hover:text-ink-900 transition-colors">
    {children}
    <ArrowRight className="w-4 h-4" aria-hidden />
  </Link>
);

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />

      <main className="flex-1">
        {/* Hero */}
        <section className="max-w-[1200px] mx-auto px-4 md:px-8 pt-10 md:pt-16 pb-16 md:pb-20 flex flex-wrap gap-10 md:gap-14 items-center">
          <div className="flex-[1_1_440px] min-w-0 flex flex-col gap-6 animate-fade-up">
            <span className="self-start px-3.5 py-1.5 rounded-full bg-butter-100 text-butter-800 text-[13px] font-semibold">
              Handcrafted beaded jewelry · Made to order
            </span>
            <h1 className="font-display font-semibold text-[40px] sm:text-[52px] lg:text-[68px] leading-[1.02] tracking-[-0.025em]">
              Beaded jewelry, <span className="text-peri-500">made by hand</span> just for you.
            </h1>
            <p className="text-[17px] md:text-[19px] leading-relaxed text-ink-600 max-w-[500px]">
              Keychains, necklaces, bracelets and magnets, each strung to order in the colors you choose.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link href="/shop" className="btn btn-primary btn-lg">
                Shop the collection <ArrowRight className="w-[18px] h-[18px]" aria-hidden />
              </Link>
              <a href={MESSENGER_URL} target="_blank" rel="noopener noreferrer" className="btn btn-secondary btn-lg">
                Ask for a custom piece
              </a>
            </div>
            <ul className="flex flex-wrap gap-x-5 gap-y-2 text-sm font-medium text-ink-600">
              <li className="flex items-center gap-2"><Heart className="w-[18px] h-[18px] text-peri-600" aria-hidden />Handmade</li>
              <li className="flex items-center gap-2"><PenLine className="w-[18px] h-[18px] text-peri-600" aria-hidden />Customizable</li>
              <li className="flex items-center gap-2"><Truck className="w-[18px] h-[18px] text-peri-600" aria-hidden />Delivered in 2–5 business days</li>
            </ul>
          </div>

          <div className="flex-[1_1_440px] min-w-0 relative h-[380px] sm:h-[520px] lg:h-[560px]">
            <div className="absolute right-0 top-0 w-[80%] h-[82%] rounded-[32px] overflow-hidden shadow-overlay bg-cream-200">
              <Image src="/background/kynchnbg.jpg" alt="A handmade beaded keychain" fill priority sizes="(max-width: 768px) 80vw, 460px" className="object-cover" />
            </div>
            <div className="absolute left-0 bottom-0 w-[46%] h-[46%] rounded-3xl overflow-hidden border-[6px] border-cream-100 shadow-raised bg-cream-200">
              <Image src="/product-images/danglingco/cherry-choker.jpg" alt="Cherry choker necklace" fill sizes="(max-width: 768px) 46vw, 260px" className="object-cover" />
            </div>
            <div className="absolute right-4 sm:right-6 bottom-3 sm:bottom-7 w-24 h-24 sm:w-[120px] sm:h-[120px] flex items-center justify-center" aria-hidden>
              <FlowerMark size={120} petal="var(--color-butter-400)" center="var(--color-butter-100)" className="absolute inset-0 w-full h-full" />
              <span className="relative font-display text-[13px] sm:text-[15px] leading-tight font-semibold text-center">Made<br />to order</span>
            </div>
          </div>
        </section>

        {/* Categories */}
        <section className="max-w-[1200px] mx-auto px-4 md:px-8 pb-20 md:pb-24 flex flex-col gap-7">
          <SectionHeading action={<SeeAll href="/shop">See everything</SeeAll>}>Shop by category</SectionHeading>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
            {CATEGORY_TILES.map((tile) => (
              <Link
                key={tile.id}
                href={`/shop?category=${categorySlug(tile.id)}`}
                className="group relative block aspect-[3/4] rounded-3xl overflow-hidden bg-peri-50"
              >
                {tile.image ? (
                  <Image src={tile.image} alt="" fill sizes="(max-width: 1024px) 50vw, 280px" className="object-cover transition-transform duration-500 ease-soft group-hover:scale-[1.04]" />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <FlowerMark size={96} className="transition-transform duration-500 ease-soft group-hover:scale-[1.06]" />
                  </div>
                )}
                <div className="absolute left-2.5 right-2.5 bottom-2.5 sm:left-3 sm:right-3 sm:bottom-3 px-3.5 sm:px-4 py-3 sm:py-3.5 rounded-2xl bg-white flex items-center justify-between gap-2">
                  <span className="font-display text-base sm:text-xl font-semibold leading-tight">{tile.label}</span>
                  <ArrowRight className="w-[18px] h-[18px] text-peri-600 shrink-0 transition-transform duration-200 ease-soft group-hover:translate-x-0.5" aria-hidden />
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* How to order */}
        <section id="how" className="bg-white border-y border-cream-300 scroll-mt-20">
          <div className="max-w-[1200px] mx-auto px-4 md:px-8 py-16 md:py-20 flex flex-col gap-9">
            <div className="flex flex-col gap-2.5 max-w-[620px]">
              <span className="eyebrow">How to order</span>
              <h2 className="font-display text-[30px] md:text-[40px] leading-[1.1] font-semibold">No checkout forms. Just a chat.</h2>
            </div>
            <ol className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5">
              {STEPS.map((step, i) => (
                <li key={step.title} className="p-6 md:p-7 rounded-3xl bg-cream-100 flex flex-col gap-3">
                  <span className="w-11 h-11 rounded-full bg-peri-600 text-white flex items-center justify-center font-display text-xl font-semibold">{i + 1}</span>
                  <span className="text-xl font-semibold">{step.title}</span>
                  <span className="text-ink-600">{step.body}</span>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* Recent products */}
        <section className="max-w-[1200px] mx-auto px-4 md:px-8 py-20 md:py-24 flex flex-col gap-7">
          <SectionHeading action={<SeeAll href="/shop">Shop all</SeeAll>}>Recently strung</SectionHeading>
          <RecentProducts />
        </section>

        {/* Reviews */}
        <section id="reviews" className="max-w-[1200px] mx-auto px-4 md:px-8 pb-20 md:pb-24 flex flex-col gap-7 scroll-mt-20">
          <SectionHeading>What customers say</SectionHeading>
          <CustomerFeedback />
        </section>

        {/* Custom order CTA */}
        <section className="max-w-[1200px] mx-auto px-4 md:px-8 pb-20 md:pb-24">
          <div className="rounded-[32px] bg-peri-50 p-8 md:p-12 flex flex-wrap gap-6 items-center justify-between">
            <div className="flex flex-col gap-2 max-w-[560px]">
              <h2 className="font-display text-[28px] md:text-[34px] leading-[1.15] font-semibold">Have something specific in mind?</h2>
              <p className="text-[17px] text-ink-600">Names, colors, matching sets: tell us what you’re picturing and we’ll make it.</p>
            </div>
            <a href={MESSENGER_URL} target="_blank" rel="noopener noreferrer" className="btn btn-primary btn-lg">
              <MessageCircle className="w-[18px] h-[18px]" aria-hidden /> Message us
            </a>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
