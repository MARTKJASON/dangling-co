import { Category } from './products';

export interface CategoryInfo {
  id: Category;
  /** Plural label for chips, headings and navigation. */
  label: string;
  /** Singular label for a single product's eyebrow. */
  singular: string;
}

export const CATEGORIES: CategoryInfo[] = [
  { id: 'keychain', label: 'Keychains', singular: 'Keychain' },
  { id: 'necklace', label: 'Necklaces', singular: 'Necklace' },
  { id: 'bracelet / anklet', label: 'Bracelets & anklets', singular: 'Bracelet / anklet' },
  { id: 'magnet', label: 'Magnets', singular: 'Magnet' },
];

export const isCategory = (value: string | null | undefined): value is Category =>
  CATEGORIES.some((c) => c.id === value);

export const getCategoryInfo = (category: string): CategoryInfo | undefined =>
  CATEGORIES.find((c) => c.id === category);

/** URL-friendly slug for a category, used in /shop?category=… */
export const categorySlug = (category: Category): string =>
  category === 'bracelet / anklet' ? 'bracelet' : category;

export const categoryFromSlug = (slug: string | null): Category | null => {
  if (!slug) return null;
  if (slug === 'bracelet') return 'bracelet / anklet';
  return isCategory(slug) ? slug : null;
};
