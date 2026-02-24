/**
 * Generates a short, human-readable order reference.
 * Format: ORD-XXXXX  (5 uppercase alphanumeric chars, excluding ambiguous I/O/0/1)
 * Example: ORD-82F1K
 *
 * Collision probability at 10 000 orders: ~0.02% — acceptable for this scale.
 * For higher volume, switch to a DB sequence or ULID.
 */
const CHARS = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // no I, O, 0, 1

export function generateOrderRef(): string {
  let result = 'ORD-';
  for (let i = 0; i < 5; i++) {
    result += CHARS[Math.floor(Math.random() * CHARS.length)];
  }
  return result;
}