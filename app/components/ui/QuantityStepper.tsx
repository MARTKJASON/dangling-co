'use client';

import React, { FC } from 'react';
import { Minus, Plus } from 'lucide-react';

interface QuantityStepperProps {
  value: number;
  onChange: (value: number) => void;
  label: string;
  min?: number;
  max?: number;
}

export const QuantityStepper: FC<QuantityStepperProps> = ({ value, onChange, label, min = 1, max = 20 }) => (
  <div className="inline-flex items-center rounded-full bg-white shadow-[inset_0_0_0_1px_var(--color-cream-300)]">
    <button type="button" onClick={() => onChange(value - 1)} disabled={value <= min} aria-label={`Decrease quantity of ${label}`} className="icon-btn">
      <Minus className="w-4 h-4" aria-hidden />
    </button>
    <span className="min-w-6 text-center font-semibold tabular-nums" aria-live="polite">{value}</span>
    <button type="button" onClick={() => onChange(value + 1)} disabled={value >= max} aria-label={`Increase quantity of ${label}`} className="icon-btn">
      <Plus className="w-4 h-4" aria-hidden />
    </button>
  </div>
);
