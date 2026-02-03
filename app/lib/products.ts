// lib/products.ts

export interface Product {
  id: string;
  name: string;
  price: string;
  image: string;
  description: string;
  category: Category;
}

export interface ProductsByCategory {
  [key: string]: Product[];
  necklace: Product[];
  bracelet: Product[];
  keychain: Product[];
  anklet: Product[];
  magnet: Product[];
}

export type Category = 'necklace' | 'bracelet' | 'keychain' | 'anklet' | 'magnet';
