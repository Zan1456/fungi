import { mergeWishItems } from '@stores/wishHistory';
import type { BannerTypeKey } from './wishTypes';

const GACHA_TYPE_TO_BANNER: Record<string, BannerTypeKey> = {
  '100': 'beginners',
  '200': 'standard',
  '301': 'character-event',
  '400': 'character-event',
  '302': 'weapon-event',
  '500': 'chronicled',
};

interface RawWishRow {
  id: string;
  gacha_type: string;
  item_id: string;
  name: string;
  rank_type: string;
  time: string;
  item_type: string;
}

export interface ImportSummary {
  imported: number;
  perBanner: Partial<Record<BannerTypeKey, number>>;
}

export async function importWishesFromUrl(url: string): Promise<ImportSummary> {
  const res = await fetch('/api/wish/import', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ url }),
  });

  if (!res.ok) {
    const errBody = await res.json().catch(() => ({}) as { message?: string });
    throw new Error(errBody.message || `Import failed (HTTP ${res.status})`);
  }

  const { rows } = (await res.json()) as { rows: RawWishRow[] };

  const grouped = new Map<BannerTypeKey, RawWishRow[]>();
  for (const row of rows) {
    const bannerType = GACHA_TYPE_TO_BANNER[row.gacha_type];
    if (!bannerType) continue;
    if (!grouped.has(bannerType)) grouped.set(bannerType, []);
    grouped.get(bannerType)!.push(row);
  }

  const perBanner: Partial<Record<BannerTypeKey, number>> = {};
  let imported = 0;

  for (const [bannerType, list] of grouped) {
    const items = list.map((row) => ({
      id: row.id,
      type: (row.item_type === 'Character' ? 'character' : 'weapon') as 'character' | 'weapon',
      itemId: row.item_id,
      name: row.name,
      rarity: Number(row.rank_type) as 3 | 4 | 5,
      bannerType,
      time: row.time,
    }));
    mergeWishItems(bannerType, items);
    perBanner[bannerType] = items.length;
    imported += items.length;
  }

  return { imported, perBanner };
}
