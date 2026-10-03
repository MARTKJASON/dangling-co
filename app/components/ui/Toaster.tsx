'use client';

import React, { FC } from 'react';
import { AlertCircle, Check } from 'lucide-react';
import { useToast } from '@/app/store/useToast';

/** Renders the global toast queue at the bottom of the screen. */
export const Toaster: FC = () => {
  const toasts = useToast((s) => s.toasts);
  const dismiss = useToast((s) => s.dismiss);

  return (
    <div
      aria-live="polite"
      className="fixed z-[70] left-3 right-3 bottom-24 md:bottom-6 md:left-auto md:right-6 md:w-[380px] flex flex-col gap-2 pointer-events-none"
    >
      {toasts.map((t) => (
        <div
          key={t.id}
          role={t.tone === 'error' ? 'alert' : 'status'}
          className={`pointer-events-auto flex items-center gap-3 pl-4 pr-2 py-2 min-h-14 rounded-2xl shadow-overlay animate-fade-up ${
            t.tone === 'error' ? 'bg-cherry-100 text-cherry-700' : 'bg-ink-900 text-white'
          }`}
        >
          {t.tone === 'error' ? (
            <AlertCircle className="w-5 h-5 shrink-0" aria-hidden />
          ) : (
            <span className="w-7 h-7 shrink-0 rounded-full bg-sage-400 text-ink-900 flex items-center justify-center">
              <Check className="w-4 h-4" strokeWidth={2.6} aria-hidden />
            </span>
          )}
          <span className="flex-1 text-[15px] font-medium">{t.message}</span>
          {t.action && (
            <button
              type="button"
              onClick={() => {
                t.action!.onClick();
                dismiss(t.id);
              }}
              className={`px-3 min-h-11 rounded-full font-semibold text-[15px] ${
                t.tone === 'error' ? 'text-cherry-700 hover:bg-white/60' : 'text-butter-400 hover:bg-white/10'
              }`}
            >
              {t.action.label}
            </button>
          )}
        </div>
      ))}
    </div>
  );
};
