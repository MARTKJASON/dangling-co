import { OrderItem } from "./order";

interface CreateOrderResult {
  ref: string;
}

export async function createOrder(
  items: OrderItem[],
  customerNote = '',
): Promise<CreateOrderResult> {
  const res = await fetch('/api/orders', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ items, customerNote }),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error ?? 'Failed to create order');
  }

  return data as CreateOrderResult;
}