// Typed shapes for the vendored paimon.moe data (see vendor/THIRD_PARTY_NOTICES.md).
// These interfaces describe the JS objects in ./vendor/*.js; they don't validate them at
// runtime, they just give the rest of the app real autocomplete/type-checking.

export type ElementId = 'pyro' | 'hydro' | 'anemo' | 'electro' | 'dendro' | 'cryo' | 'geo';
export type WeaponTypeId = 'sword' | 'claymore' | 'polearm' | 'catalyst' | 'bow';

export interface ElementInfo {
  id: ElementId;
  name: string;
  simpleName: string;
}

export interface WeaponTypeInfo {
  id: WeaponTypeId;
  name: string;
}

export interface Item {
  id: string;
  name: string;
  rarity?: number;
  day?: string[];
  parent?: string;
}

export interface ItemRef {
  item: Item;
  amount: number | null;
}

export interface AscensionPhase {
  items: ItemRef[];
  mora: number;
}

export interface CharacterMaterial {
  material?: Item[];
  book?: Item[];
  boss?: Item;
  local?: Item;
  common?: Item;
  [key: string]: Item[] | Item | undefined;
}

export interface Character {
  id: string;
  name: string;
  rarity: number;
  weapon: WeaponTypeInfo;
  element: ElementInfo;
  stats: { hp: number; atk: number; def: number };
  ascension: AscensionPhase[];
  material?: CharacterMaterial;
  new?: boolean;
}

export interface Weapon {
  id: string;
  name: string;
  rarity: number;
  atk: number;
  secondary?: string;
  type: WeaponTypeInfo;
  source?: string;
  ascension: AscensionPhase[];
}

export interface TalentLevelCost {
  ascension: number;
  book: { rarity: number; amount: number };
  commonMaterial: { rarity: number; amount: number };
  bossMaterial: number;
  eventMaterial: number;
  mora: number;
}

export type BannerTypeId = 'character-event' | 'weapon-event' | 'standard' | 'beginners' | 'chronicled';

export interface BannerTypeInfo {
  id: BannerTypeId;
  name: string;
}

export interface BannerEntry {
  name: string;
  shortName: string;
  image: number;
  start: string;
  end: string;
  color: string;
  version?: string;
  timezoneDependent?: boolean;
  featured?: string[];
  featuredRare?: string[];
}
