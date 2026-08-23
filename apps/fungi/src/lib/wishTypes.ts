export type BannerTypeKey = 'character-event' | 'weapon-event' | 'standard' | 'beginners' | 'chronicled';

export const bannerTypeKeys: BannerTypeKey[] = ['character-event', 'weapon-event', 'standard', 'beginners', 'chronicled'];

export interface WishItem {
  /** Upstream pull id (or a client-generated one for manual entries) — used to de-dupe imports. */
  id: string;
  type: 'character' | 'weapon';
  itemId: string;
  name: string;
  rarity: 3 | 4 | 5;
  bannerType: BannerTypeKey;
  /** ISO 8601 timestamp. */
  time: string;
}

export type WishHistoryState = Record<BannerTypeKey, WishItem[]>;

export function emptyWishHistory(): WishHistoryState {
  return {
    'character-event': [],
    'weapon-event': [],
    standard: [],
    beginners: [],
    chronicled: [],
  };
}
