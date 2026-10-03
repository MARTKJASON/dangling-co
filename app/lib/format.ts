const pesoFormatter = new Intl.NumberFormat('en-PH', {
  style: 'currency',
  currency: 'PHP',
  minimumFractionDigits: 0,
  maximumFractionDigits: 2,
});

/** Formats a peso amount, e.g. 150 → "₱150", 87.5 → "₱87.50". */
export const formatPeso = (value: number | string): string => {
  const n = typeof value === 'string' ? parseFloat(value) : value;
  if (!Number.isFinite(n)) return '₱—';
  return pesoFormatter.format(n);
};
