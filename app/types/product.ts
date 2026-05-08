import { Category } from "../lib/products";


export interface Product {
  id: string;
  name: string;
  description: string;
  category: Category;
  image_url: string;
  image_urls?: string[] | null;
  price: string;
  created_at: string;
}

export const MAX_PRODUCT_IMAGES = 5;

export const getProductImages = (product: Pick<Product, 'image_url' | 'image_urls'>): string[] => {
  const list = Array.isArray(product.image_urls)
    ? product.image_urls.filter((u): u is string => typeof u === 'string' && u.length > 0)
    : [];
  if (list.length > 0) return list;
  return product.image_url ? [product.image_url] : [];
};