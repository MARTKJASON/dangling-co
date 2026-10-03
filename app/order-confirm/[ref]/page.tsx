'use client';

import React, { FC, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Copy, Check, MessageCircle, ArrowLeft, ExternalLink, ArrowRight } from 'lucide-react';
import { FlowerMark } from '@/app/components/brand/Logo';

const FACEBOOK_PAGE_URL = 'https://m.me/696684716864112';
const APP_URL = process.env.NEXT_PUBLIC_APP_URL ;

const OrderConfirmPage: FC = () => {
  const params = useParams();
  const ref = params.ref as string;

  const [copied, setCopied] = useState(false);

  const orderUrl = `${APP_URL}/order/${ref}`;

  const messageText =
    `Hi! I'd like to order 🌸\n` +
    `Order Ref: ${ref}\n` +
    `Order Details: ${orderUrl}\n` +
    `Thank you, and I look forward to your response!`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(messageText);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    } catch {
      // Fallback for older mobile browsers
      const el = document.createElement('textarea');
      el.value = messageText;
      el.style.position = 'fixed';
      el.style.opacity = '0';
      document.body.appendChild(el);
      el.focus();
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    }
  };

  const handleOpenMessenger = () => {
    // Plain Facebook page URL — NO order details in URL (mobile safe)
    window.open(FACEBOOK_PAGE_URL, '_blank');
  };

  const steps = [
    'Tap “Copy order details” above',
    'Tap “Message us on Facebook” below',
    'Paste your message and send it',
  ];

  return (
    <div className="min-h-screen bg-cream-100 px-4 py-10 sm:py-14">
      <div className="w-full max-w-xl mx-auto space-y-5 animate-fade-up">

        {/* Success header */}
        <div className="text-center space-y-3">
          <div className="flex justify-center">
            <FlowerMark size={48} />
          </div>
          <span className="inline-flex items-center px-3 py-1 rounded-full bg-peri-50 text-peri-800 text-sm font-semibold tracking-wide">
            Order {ref}
          </span>
          <h1 className="font-display text-3xl sm:text-4xl font-semibold text-ink-900">
            You&apos;re almost done!
          </h1>
          <p className="text-[15px] text-ink-600 max-w-md mx-auto">
            Copy your order details below, then send them to us on Facebook Messenger to confirm.
          </p>
        </div>

        {/* Order ref card */}
        <div className="bg-white rounded-card border border-cream-300 shadow-rest p-5 sm:p-6 space-y-5">
          <div className="text-center space-y-1">
            <p className="eyebrow">Your order reference</p>
            <p className="font-display text-4xl font-semibold tracking-wide text-ink-900">{ref}</p>
          </div>

          {/* Message preview */}
          <div className="bg-cream-50 rounded-field border border-cream-200 p-4">
            <p className="eyebrow mb-2">Message to send</p>
            <pre className="text-[15px] text-ink-900 whitespace-pre-wrap break-words font-sans leading-relaxed">
              {messageText}
            </pre>
          </div>

          <button
            type="button"
            onClick={handleCopy}
            className={`btn btn-lg w-full ${copied ? 'btn-success' : 'btn-primary'}`}
            aria-live="polite"
          >
            {copied ? (
              <><Check className="w-5 h-5" aria-hidden="true" /> Copied!</>
            ) : (
              <><Copy className="w-5 h-5" aria-hidden="true" /> Copy order details</>
            )}
          </button>
        </div>

        {/* Step instructions */}
        <div className="bg-white rounded-card border border-cream-300 p-5 sm:p-6 space-y-3">
          <p className="eyebrow">Next steps</p>
          <ol className="space-y-3">
            {steps.map((text, i) => (
              <li key={text} className="flex items-start gap-3">
                <span className="flex-shrink-0 w-7 h-7 rounded-full bg-peri-50 text-peri-800 text-sm font-bold flex items-center justify-center">
                  {i + 1}
                </span>
                <p className="text-[15px] text-ink-900 pt-0.5">{text}</p>
              </li>
            ))}
          </ol>
        </div>

        {/* Open Messenger button */}
        <button
          type="button"
          onClick={handleOpenMessenger}
          className="btn btn-messenger btn-lg w-full"
        >
          <MessageCircle className="w-5 h-5" aria-hidden="true" />
          Message us on Facebook
          <ExternalLink className="w-4 h-4 opacity-80" aria-hidden="true" />
          <span className="sr-only">(opens in a new tab)</span>
        </button>

        {/* Secondary links */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-3 pt-1">
          <Link href={`/order/${ref}`} className="btn btn-ghost btn-sm">
            View order details
            <ArrowRight className="w-4 h-4" aria-hidden="true" />
          </Link>
          <Link href="/shop" className="btn btn-ghost btn-sm text-ink-600">
            <ArrowLeft className="w-4 h-4" aria-hidden="true" />
            Back to shop
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmPage;
