// Typed entry point over the vendored paimon.moe data — see ./vendor/THIRD_PARTY_NOTICES.md.
import { characters as vendorCharacters } from './vendor/characters';
import { weaponList as vendorWeaponList } from './vendor/weaponList';
import { itemList as vendorItemList } from './vendor/itemList';
import { weapons as vendorWeaponTypes } from './vendor/weapons';
import { elements as vendorElements } from './vendor/elements';
import { talent as vendorTalent } from './vendor/talent';
import { characterExp as vendorCharacterExp } from './vendor/characterExp';
import { weaponExp as vendorWeaponExp } from './vendor/weaponExp';
import { friendshipExp as vendorFriendshipExp, commissionExp as vendorCommissionExp } from './vendor/friendshipExp';
import { bannerTypes as vendorBannerTypes } from './vendor/bannerTypes';
import { banners as vendorBanners } from './vendor/banners';

import type {
  Character,
  Weapon,
  Item,
  ElementInfo,
  WeaponTypeInfo,
  TalentLevelCost,
  ElementId,
  WeaponTypeId,
  BannerTypeInfo,
  BannerEntry,
} from './types';

export * from './types';

export const characters = vendorCharacters as unknown as Record<string, Character>;
export const weaponList = vendorWeaponList as unknown as Record<string, Weapon>;
export const itemList = vendorItemList as unknown as Record<string, Item>;
export const weaponTypes = vendorWeaponTypes as unknown as Record<WeaponTypeId, WeaponTypeInfo>;
export const elements = vendorElements as unknown as Record<ElementId, ElementInfo>;
export const talent = vendorTalent as unknown as TalentLevelCost[];
export const characterExp = vendorCharacterExp as number[];
export const weaponExp = vendorWeaponExp as number[][];
export const friendshipExp = vendorFriendshipExp as number[];
export const commissionExp = vendorCommissionExp as number[];
export const bannerTypes = vendorBannerTypes as unknown as BannerTypeInfo[];
export const banners = vendorBanners as unknown as Record<string, BannerEntry[]>;

export function getCharacterList(): Character[] {
  return Object.values(characters);
}

export function getCharacter(id: string): Character | undefined {
  return characters[id];
}

export function getWeaponListArray(): Weapon[] {
  return Object.values(weaponList);
}

export function getWeapon(id: string): Weapon | undefined {
  return weaponList[id];
}

export function getWeaponsByType(type: WeaponTypeId): Weapon[] {
  return getWeaponListArray().filter((w) => w.type?.id === type);
}

export function getItem(id: string): Item | undefined {
  return itemList[id];
}
