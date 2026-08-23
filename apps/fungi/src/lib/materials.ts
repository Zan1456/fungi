import { getCharacter, getWeapon, talent as talentCosts } from '@data/index';
import type { Item } from '@data/types';

export interface TalentRange {
  normal: [number, number];
  skill: [number, number];
  burst: [number, number];
}

export interface PlannerEntry {
  characterId: string;
  /** Ascension phase indices, 0-6 (0 = unascended, 6 = fully ascended). */
  currentAscension: number;
  targetAscension: number;
  talents: TalentRange;
  weaponId?: string;
  weaponCurrentAscension?: number;
  weaponTargetAscension?: number;
}

export interface MaterialTotal {
  item: Item;
  amount: number;
}

export interface AggregateResult {
  items: Map<string, MaterialTotal>;
  mora: number;
}

function addItem(items: Map<string, MaterialTotal>, item: Item | null | undefined, amount: number | null | undefined) {
  if (!item || !amount || item.id === 'none' || item.id === 'unknown') return;
  const existing = items.get(item.id);
  if (existing) {
    existing.amount += amount;
  } else {
    items.set(item.id, { item, amount });
  }
}

/**
 * Sums ascension + talent (and optional weapon ascension) material costs across every
 * planner entry into one merged total. Pure function — no store/React dependency, so it's
 * directly unit-testable.
 */
export function aggregateMaterials(entries: PlannerEntry[]): AggregateResult {
  const items = new Map<string, MaterialTotal>();
  let mora = 0;

  for (const entry of entries) {
    const character = getCharacter(entry.characterId);
    if (!character) continue;

    for (let phase = entry.currentAscension; phase < entry.targetAscension; phase++) {
      const ascension = character.ascension[phase];
      if (!ascension) continue;
      mora += ascension.mora;
      for (const ref of ascension.items) {
        addItem(items, ref.item, ref.amount);
      }
    }

    // Talent material costs reference a material *tier* by rarity, resolved against this
    // character's own 3-tier book/common-material progression (see talent.js: `book.rarity`
    // 2/3/4 -> character.material.book[0/1/2], `commonMaterial.rarity` 1/2/3 -> material[0/1/2]).
    const tiers: Array<[number, number]> = [entry.talents.normal, entry.talents.skill, entry.talents.burst];
    for (const [current, target] of tiers) {
      for (let level = current; level < target; level++) {
        const cost = talentCosts[level - 1];
        if (!cost) continue;
        mora += cost.mora;

        const book = character.material?.book?.[cost.book.rarity - 2];
        addItem(items, book, cost.book.amount);

        const common = character.material?.material?.[cost.commonMaterial.rarity - 1];
        addItem(items, common, cost.commonMaterial.amount);

        if (cost.bossMaterial > 0 && character.material?.boss) {
          addItem(items, character.material.boss, cost.bossMaterial);
        }
      }
    }

    if (entry.weaponId && entry.weaponCurrentAscension != null && entry.weaponTargetAscension != null) {
      const weapon = getWeapon(entry.weaponId);
      if (weapon) {
        for (let phase = entry.weaponCurrentAscension; phase < entry.weaponTargetAscension; phase++) {
          const ascension = weapon.ascension[phase];
          if (!ascension) continue;
          mora += ascension.mora;
          for (const ref of ascension.items) {
            addItem(items, ref.item, ref.amount);
          }
        }
      }
    }
  }

  return { items, mora };
}
