/**
 * GET /api/keep-alive
 *
 * Called once a day by the Vercel cron in vercel.json (6:00 AM Philippine time).
 * Supabase pauses free-tier projects after about a week without requests, which
 * would leave the shop with no products. A tiny query here keeps it awake.
 *
 * If CRON_SECRET is set in the Vercel project, Vercel sends it as
 * "Authorization: Bearer <CRON_SECRET>" and anything else is rejected.
 */
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const secret = process.env.CRON_SECRET;
  if (secret && req.headers.get('authorization') !== `Bearer ${secret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );

  // Count only (no rows returned): the cheapest real query against the database.
  const { count, error } = await supabase
    .from('products')
    .select('id', { count: 'exact', head: true });

  if (error) {
    console.error('Keep-alive query failed:', error);
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true, products: count, at: new Date().toISOString() });
}
