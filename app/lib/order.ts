import { Product } from "./products";

// ─── Order List (local state) ──────────────────────────────────────────────
export interface OrderItem {
  product: Product;
  quantity: number;
  note: string; // e.g. "Color: blue, Size: small"
}

// ─── Supabase DB rows ──────────────────────────────────────────────────────
export type OrderStatus =
  | 'pending_messenger_confirmation'
  | 'confirmed'
  | 'in_progress'
  | 'completed'
  | 'cancelled';

export interface OrderRow {
  id: string;                  // uuid
  ref: string;                 // e.g. "ORD-82F1K"
  status: OrderStatus;
  total_price: number;
  customer_note: string | null;
  created_at: string;
}

export interface OrderItemRow {
  id: string;
  order_id: string;
  product_id: string;
  product_name: string;        // snapshot — survives product edits/deletes
  product_image_url: string;
  unit_price: number;
  quantity: number;
  note: string | null;
}

// ─── Joined shape returned by the order details page ──────────────────────
export interface OrderWithItems extends OrderRow {
  order_items: (OrderItemRow & { products: Product | null })[];
}