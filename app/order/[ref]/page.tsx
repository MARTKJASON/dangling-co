import React from 'react';
import { notFound } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';
import { OrderWithItems } from '@/app/lib/order';
import { OrderDetailsClient } from './OrderDetailsClient';


// Server-side Supabase client (service role for read)
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

interface PageProps {
  params: { ref: string };
}

// Fetch on every request — staff needs live status updates
export const revalidate = 0;

async function getOrder(ref?: string | null): Promise<OrderWithItems | null> {
  if (!ref) return null; // guard
  const { data, error } = await supabase
    .from('orders')
    .select(`
      *,
      order_items (
        *,
        products ( id, name, image_url, category )
      )
    `)
    .eq('ref', ref.toUpperCase())
    .single();

  if (error || !data) return null;
  return data as OrderWithItems;
}

export default async function OrderDetailsPage({ params }: { params: Promise<{ ref: string }> }) {
  const { ref } = await params; // unwrap the promise

  if (!ref) notFound();

  const order = await getOrder(ref);

  if (!order) notFound();

  return <OrderDetailsClient order={order} />;
}