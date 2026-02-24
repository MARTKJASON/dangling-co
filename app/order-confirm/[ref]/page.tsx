'use client';

import React, { FC, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Copy, Check, MessageCircle, ArrowLeft, ExternalLink } from 'lucide-react';

const FACEBOOK_PAGE_URL = 'https://www.facebook.com/profile.php?id=61577634874235';
const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'https://yourdomain.com';

const OrderConfirmPage: FC = () => {
  const params = useParams();
  const router = useRouter();
  const ref = params.ref as string;

  const [copied, setCopied] = useState(false);

  const orderUrl = `${APP_URL}/order/${ref}`;

  const messageText =
    `Hi! I want to order.\n` +
    `Order Ref: ${ref}\n` +
    `Order Details: ${orderUrl}`;

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

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#faf7e5] via-[#f5e4c0] to-[#f0d9b5] flex items-center justify-center px-4 py-12">

      {/* Ambient blobs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-20 left-10 w-56 h-56 bg-purple-300 rounded-full opacity-20 blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-56 h-56 bg-pink-300 rounded-full opacity-15 blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      <div className="relative w-full max-w-md space-y-5">

        {/* Success header */}
        <div className="text-center space-y-2">
          <div className="text-5xl animate-bounce">🎉</div>
          <h1 className="text-2xl font-extrabold text-gray-900">Order Created!</h1>
          <p className="text-gray-500 text-sm">
            Copy your order details, then message us on Facebook.
          </p>
        </div>

        {/* Order ref card */}
        <div className="bg-white rounded-3xl border-2 border-purple-100 shadow-xl p-6 space-y-4">

          <div className="text-center space-y-1">
            <p className="text-xs font-bold uppercase tracking-widest text-purple-400">
              Your Order Reference
            </p>
            <p className="text-4xl font-black tracking-widest bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">
              {ref}
            </p>
          </div>

          <div className="h-px bg-purple-100" />

          {/* Message preview */}
          <div className="bg-purple-50 rounded-2xl p-4 border border-purple-100">
            <p className="text-xs font-bold uppercase tracking-widest text-purple-400 mb-2">
              Message to send
            </p>
            <pre className="text-sm text-gray-700 whitespace-pre-wrap font-sans leading-relaxed">
              {messageText}
            </pre>
          </div>

          {/* Copy button */}
          <button
            onClick={handleCopy}
            className={`w-full flex items-center justify-center gap-2 px-5 py-3.5 font-bold rounded-2xl transition-all duration-300 ${
              copied
                ? 'bg-green-500 text-white shadow-green-200 shadow-lg'
                : 'bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600 shadow-lg hover:scale-[1.02]'
            }`}
          >
            {copied ? (
              <><Check className="w-5 h-5" /> Copied!</>
            ) : (
              <><Copy className="w-5 h-5" /> Copy Order Details</>
            )}
          </button>
        </div>

        {/* Step instructions */}
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl border border-amber-100 p-5 space-y-3">
          <p className="text-xs font-bold uppercase tracking-widest text-amber-500">Next steps</p>
          {[
            { num: '1', text: 'Tap "Copy Order Details" above' },
            { num: '2', text: 'Tap "Message Us on Facebook" below' },
            { num: '3', text: 'Paste your message and send it' },
          ].map((step) => (
            <div key={step.num} className="flex items-start gap-3">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 text-white text-xs font-black flex items-center justify-center">
                {step.num}
              </span>
              <p className="text-sm text-gray-700 font-medium pt-0.5">{step.text}</p>
            </div>
          ))}
        </div>

        {/* Open Messenger button */}
        <button
          onClick={handleOpenMessenger}
          className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-[#0866FF] hover:bg-[#0757E0] text-white font-bold rounded-2xl shadow-lg transition-all hover:scale-[1.02] active:scale-100 text-lg"
        >
          <MessageCircle className="w-5 h-5" />
          Message Us on Facebook
          <ExternalLink className="w-4 h-4 opacity-70" />
        </button>

        {/* View order page link */}
        <div className="text-center space-y-1">
          <p className="text-xs text-gray-400">Want to review your order?</p>
          <button
            onClick={() => router.push(`/order/${ref}`)}
            className="text-sm font-semibold text-purple-600 hover:text-purple-800 underline underline-offset-2 transition-colors"
          >
            View order details page →
          </button>
        </div>

        {/* Back to store */}
        <button
          onClick={() => router.push('/store')}
          className="w-full flex items-center justify-center gap-2 text-sm text-gray-500 hover:text-gray-700 font-medium transition-colors py-2"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Store
        </button>
      </div>
    </div>
  );
};

export default OrderConfirmPage;