import type { WishItem } from './wishTypes';

export interface PityCounts {
  /** Pulls since the last 4★ (0 means the most recent pull was a 4★). */
  pity4: number;
  /** Pulls since the last 5★. */
  pity5: number;
  total: number;
}

/**
 * Pure pity counter over one banner type's pull history. 4★ and 5★ pity are independent
 * counters in Genshin (pulling a 5★ does not reset the 4★ counter, and vice versa), so each
 * only resets on its own rarity.
 */
export function computePity(history: WishItem[]): PityCounts {
  const sorted = [...history].sort((a, b) => a.time.localeCompare(b.time));
  let pity4 = 0;
  let pity5 = 0;
  for (const wish of sorted) {
    pity4++;
    pity5++;
    if (wish.rarity === 4) pity4 = 0;
    if (wish.rarity === 5) pity5 = 0;
  }
  return { pity4, pity5, total: sorted.length };
}

export const SOFT_PITY_4 = 10;
export const SOFT_PITY_5 = 90;
