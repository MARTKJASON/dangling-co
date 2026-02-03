import { Category } from "../lib/products";


export interface Product {
  id: string;
  name: string;
  description: string;
  category: Category;
  image_url: string;
  price: string;    
  created_at: string;
}