import { useSyncExternalStore } from 'react';

const subscribe = () => () => {};

/**
 * True on the client after hydration, false during the server render and the
 * hydration pass. Use it to gate values that come from localStorage (like the
 * persisted basket) so the server and first client render match.
 */
export const useHydrated = (): boolean =>
  useSyncExternalStore(subscribe, () => true, () => false);
