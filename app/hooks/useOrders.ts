'use client';

import { useState, useCallback } from 'react';
import { supabase } from '@/app/lib/supabase';

export type OrderStatus =
  | 'pending_messenger_confirmation'
  | 'confirmed'
  | 'in_progress'
  | 'completed'
  | 'cancelled';

export interface OrderItemRow {
  id: string;
  product_name: string;
  product_image_url: string;
  unit_price: number;
  quantity: number;
  note: string | null;
}

export interface Order {
  id: string;
  ref: string;
  status: OrderStatus;
  total_price: number;
  customer_note: string | null;
  created_at: string;
  order_items: OrderItemRow[];
}

interface UseOrdersReturn {
  orders: Order[];
  loading: boolean;
  error: string | null;
  loadOrders: () => Promise<void>;
  updateOrderStatus: (id: string, status: OrderStatus) => Promise<void>;
}

export const useOrders = (): UseOrdersReturn => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadOrders = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, error: fetchError } = await supabase
        .from('orders')
        .select(`
          *,
          order_items (
            id,
            product_name,
            product_image_url,
            unit_price,
            quantity,
            note
          )
        `)
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;
      setOrders((data as Order[]) || []);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to load orders';
      setError(message);
      console.error('Error loading orders:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const updateOrderStatus = useCallback(async (id: string, status: OrderStatus) => {
    // Optimistic update
    setOrders((prev) =>
      prev.map((o) => (o.id === id ? { ...o, status } : o))
    );

    try {
      const { error: updateError } = await supabase
        .from('orders')
        .update({ status })
        .eq('id', id);

      if (updateError) throw updateError;
    } catch (err) {
      // Rollback on failure by reloading
      console.error('Error updating order status:', err);
      throw err;
    }
  }, []);

  return { orders, loading, error, loadOrders, updateOrderStatus };
};