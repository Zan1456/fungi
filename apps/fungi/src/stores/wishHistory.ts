import { persistentAtom } from '@nanostores/persistent';
import { emptyWishHistory, type BannerTypeKey, type WishHistoryState, type WishItem } from '@lib/wishTypes';

export const wishHistory = persistentAtom<WishHistoryState>('fungi:wishHistory', emptyWishHistory(), {
  encode: JSON.stringify,
  decode: (raw) => ({ ...emptyWishHistory(), ...JSON.parse(raw) }),
});

/** Merges new pulls into one banner's history, de-duplicating by pull id. */
export function mergeWishItems(bannerType: BannerTypeKey, items: WishItem[]) {
  const state = wishHistory.get();
  const existingIds = new Set(state[bannerType].map((w) => w.id));
  const merged = [...state[bannerType], ...items.filter((w) => !existingIds.has(w.id))];
  wishHistory.set({ ...state, [bannerType]: merged });
}

export function clearBanner(bannerType: BannerTypeKey) {
  wishHistory.set({ ...wishHistory.get(), [bannerType]: [] });
}

export function replaceAll(next: WishHistoryState) {
  wishHistory.set({ ...emptyWishHistory(), ...next });
}
