export const categoryColors: Record<string, { gradient: string; bg: string; text: string; border: string; shadow: string }> = {
  necklace: { gradient: 'from-purple-400 to-pink-300', bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200', shadow: 'shadow-purple-100' },
  bracelet: { gradient: 'from-blue-400 to-cyan-300', bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200', shadow: 'shadow-blue-100' },
  keychain: { gradient: 'from-amber-400 to-orange-300', bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200', shadow: 'shadow-amber-100' },
  anklet: { gradient: 'from-rose-400 to-red-300', bg: 'bg-rose-50', text: 'text-rose-700', border: 'border-rose-200', shadow: 'shadow-rose-100' },
  magnet: { gradient: 'from-green-400 to-emerald-300', bg: 'bg-green-50', text: 'text-green-700', border: 'border-green-200', shadow: 'shadow-green-100' },
};

export const categoryEmojis: Record<string, string> = {
  necklace: '✨',
  bracelet: '🌀',
  keychain: '🔑',
  anklet: '💫',
  magnet: '🧲',
};

export type CategoryColor = typeof categoryColors[string];