import huCommon from '@i18n/hu/common.json';
import enCommon from '@i18n/en/common.json';
import huCharacters from '@i18n/hu/characters.json';
import enCharacters from '@i18n/en/characters.json';
import huCalculator from '@i18n/hu/calculator.json';
import enCalculator from '@i18n/en/calculator.json';
import huWish from '@i18n/hu/wish.json';
import enWish from '@i18n/en/wish.json';

export const locales = ['hu', 'en'] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = 'hu';

// Each locale's dictionary is every per-module JSON namespace merged into one flat object.
// Add a new module's { hu, en } json files to both merges below to register its keys.
const hu = { ...huCommon, ...huCharacters, ...huCalculator, ...huWish };
const en = { ...enCommon, ...enCharacters, ...enCalculator, ...enWish };

type Dictionary = typeof hu;
export type TranslationKey = keyof Dictionary;

const dictionaries: Record<Locale, Dictionary> = {
  hu,
  en: en as Dictionary,
};

export function isLocale(value: string | undefined): value is Locale {
  return !!value && (locales as readonly string[]).includes(value);
}

/** Returns a `t(key)` translator bound to one locale. Falls back to hu, then the raw key. */
export function useTranslations(locale: Locale) {
  const dict = dictionaries[locale] ?? dictionaries[defaultLocale];
  return function t(key: TranslationKey): string {
    return dict[key] ?? dictionaries[defaultLocale][key] ?? key;
  };
}

/** Swaps the leading /hu|/en segment of a path, preserving the rest. */
export function localizePath(path: string, locale: Locale): string {
  const rest = path.replace(/^\/(hu|en)(?=\/|$)/, '') || '/';
  return `/${locale}${rest === '/' ? '' : rest}`;
}
