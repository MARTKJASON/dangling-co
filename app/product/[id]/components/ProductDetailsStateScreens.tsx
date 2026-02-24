'use client';

import React, { FC } from 'react';
import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

const Wrapper: FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="min-h-screen bg-gradient-to-b from-[#faf7e5] to-[#f5e4c0] flex items-center justify-center">
    <div className="text-center px-4">{children}</div>
  </div>
);

const BackButton: FC = () => {
  const router = useRouter();
  return (
    <button
      onClick={() => router.push('/store')}
      className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-amber-400 to-orange-400 text-white font-bold rounded-full shadow-lg hover:scale-105 transition-all"
    >
      <ArrowLeft className="w-5 h-5" /> Back to Collection
    </button>
  );
};

export const LoadingScreen: FC = () => (
  <Wrapper>
    <div className="text-6xl mb-4 animate-bounce">✨</div>
    <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-3">
      Loading your bead...
    </h1>
    <p className="text-gray-500">Getting the details ready for you!</p>
  </Wrapper>
);

export const ErrorScreen: FC<{ message: string }> = ({ message }) => (
  <Wrapper>
    <div className="text-6xl mb-4">⚠️</div>
    <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-3">
      Oops! Something went wrong
    </h1>
    <p className="text-gray-500 mb-8 max-w-md">{message}</p>
    <BackButton />
  </Wrapper>
);

export const NotFoundScreen: FC = () => (
  <Wrapper>
    <div className="text-6xl mb-4">🧿</div>
    <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-3">
      Bead not found
    </h1>
    <p className="text-gray-500 mb-8 max-w-md">
      This beautiful piece seems to have rolled away. Let's get you back to our collection!
    </p>
    <BackButton />
  </Wrapper>
);