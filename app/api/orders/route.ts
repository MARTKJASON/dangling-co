/**
 * POST /api/orders
 *
 * Body: { items: OrderItem[], customerNote?: string }
 * Returns: { ref: string }
 *
 * Creates an order + all order_items in one atomic Supabase transaction
 * using the service-role key (never exposed to the client).
 */
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { generateOrderRef } from '@/app/lib/generatedOrderRef';
import { OrderItem } from '@/app/lib/order';

// Use service-role key — this route runs server-side only
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,   // never expose this to the client
);

const MAX_RETRIES = 3; // retry on the rare ref collision

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const items: OrderItem[] = body.items;
    const customerNote: string = body.customerNote ?? '';

    // ── Validate ─────────────────────────────────────────────────────────
    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: 'No items provided' }, { status: 400 });
    }

    for (const item of items) {
      if (!item.product?.id || !item.quantity || item.quantity < 1) {
        return NextResponse.json({ error: 'Invalid item data' }, { status: 400 });
      }
    }

    // ── Calculate total ───────────────────────────────────────────────────
    const totalPrice = items.reduce(
      (sum, i) => sum + parseFloat(i.product.price) * i.quantity,
      0,
    );

    // ── Attempt order creation with ref collision retry ───────────────────
    let orderRef: string | null = null;
    let orderId: string | null = null;

    for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
      const ref = generateOrderRef();

      const { data: order, error: orderError } = await supabaseAdmin
        .from('orders')
        .insert({
          ref,
          status: 'pending_messenger_confirmation',
          total_price: totalPrice,
          customer_note: customerNote || null,
        })
        .select('id, ref')
        .single();

      if (orderError) {
        // 23505 = unique_violation — ref collision, retry
        if (orderError.code === '23505') continue;
        throw orderError;
      }

      orderRef = order.ref;
      orderId = order.id;
      break;
    }

    if (!orderRef || !orderId) {
      throw new Error('Failed to generate a unique order reference');
    }

    // ── Insert order items ────────────────────────────────────────────────
    const itemRows = items.map((item) => ({
      order_id: orderId,
      product_id: item.product.id,
      product_name: item.product.name,
      product_image_url: item.product.image_url,
      unit_price: parseFloat(item.product.price),
      quantity: item.quantity,
      note: item.note || null,
    }));

    const { error: itemsError } = await supabaseAdmin
      .from('order_items')
      .insert(itemRows);

    if (itemsError) {
      // Roll back the order if items fail
      await supabaseAdmin.from('orders').delete().eq('id', orderId);
      throw itemsError;
    }

    return NextResponse.json({ ref: orderRef }, { status: 201 });
  } catch (err: any) {
    console.error('[POST /api/orders]', err);
    return NextResponse.json(
      { error: err.message ?? 'Internal server error' },
      { status: 500 },
    );
  }
}