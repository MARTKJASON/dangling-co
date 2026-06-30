import { OrderItem } from './order';

/** Facebook Messenger deep link for the store page. */
export const MESSENGER_URL = 'https://m.me/696684716864112';

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? '';

/**
 * Build the order message a customer pastes into Messenger.
 *
 * Includes per-item details (name, quantity, line total, note),
 * the grand total and a link back to the full order page.
 */
export function buildOrderMessage(
  ref: string,
  items: OrderItem[],
  totalPrice: number,
): string {
  const orderUrl = APP_URL ? `${APP_URL}/order/${ref}` : '';

  const lines = items.map((item) => {
    const lineTotal = (parseFloat(item.product.price) * item.quantity).toFixed(2);
    const noteLine = item.note?.trim() ? `\n   ↳ ${item.note.trim()}` : '';
    return `• ${item.product.name} ×${item.quantity} — ₱${lineTotal}${noteLine}`;
  });

  return (
    `Hi! I'd like to order 🌸\n` +
    `Order Ref: ${ref}\n\n` +
    `🛍️ Items:\n` +
    `${lines.join('\n')}\n\n` +
    `Total: ₱${totalPrice.toFixed(2)}\n` +
    (orderUrl ? `Order Details: ${orderUrl}\n\n` : `\n`) +
    `Thank you, and I look forward to your response!`
  );
}

/**
 * Copy text to the clipboard with a fallback for older mobile browsers
 * that don't support the async Clipboard API.
 */
export async function copyToClipboard(text: string): Promise<void> {
  try {
    await navigator.clipboard.writeText(text);
  } catch {
    const el = document.createElement('textarea');
    el.value = text;
    el.style.position = 'fixed';
    el.style.opacity = '0';
    document.body.appendChild(el);
    el.focus();
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
  }
}
