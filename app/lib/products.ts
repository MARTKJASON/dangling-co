// lib/products.ts

export interface Product {
  id: string;
  name: string;
  price: string;
  image: string;
  image_url: string;
  image_urls?: string[] | null;
  description: string;
  category: Category;
}

export interface ProductsByCategory {
  [key: string]: Product[];
  necklace: Product[];
  'bracelet / anklet': Product[];
  keychain: Product[];
  magnet: Product[];
}

export type Category = 'necklace' | 'bracelet / anklet' | 'keychain' | 'magnet';
