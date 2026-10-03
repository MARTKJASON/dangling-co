import React, { FC } from 'react';

interface FlowerMarkProps {
  size?: number;
  petal?: string;
  center?: string;
  className?: string;
}

/** The daisy from the Dangling Co. logo: five periwinkle petals around a butter center. */
export const FlowerMark: FC<FlowerMarkProps> = ({
  size = 30,
  petal = 'var(--color-peri-300)',
  center = 'var(--color-butter-400)',
  className,
}) => (
  <svg width={size} height={size} viewBox="0 0 40 40" aria-hidden="true" className={className}>
    <g fill={petal}>
      <circle cx="20" cy="9" r="8" />
      <circle cx="30.5" cy="16.6" r="8" />
      <circle cx="26.5" cy="29" r="8" />
      <circle cx="13.5" cy="29" r="8" />
      <circle cx="9.5" cy="16.6" r="8" />
    </g>
    <circle cx="20" cy="20" r="6.5" fill={center} />
  </svg>
);

interface LogoProps {
  /** "light" for use on dark (periwinkle) backgrounds. */
  tone?: 'default' | 'light';
  size?: 'sm' | 'md';
}

export const Logo: FC<LogoProps> = ({ tone = 'default', size = 'md' }) => (
  <span className={`flex items-center gap-2.5 ${tone === 'light' ? 'text-white' : 'text-peri-500'}`}>
    <FlowerMark size={size === 'sm' ? 26 : 30} petal={tone === 'light' ? 'var(--color-peri-100)' : undefined} />
    <span className={`font-display font-semibold tracking-[-0.01em] ${size === 'sm' ? 'text-[21px]' : 'text-[22px] sm:text-2xl'}`}>
      Dangling Co.
    </span>
  </span>
);
