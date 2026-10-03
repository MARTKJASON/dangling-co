import { redirect } from 'next/navigation';

// The store moved to /shop. Keep old links (and bookmarks) working.
export default function StoreRedirect() {
  redirect('/shop');
}
