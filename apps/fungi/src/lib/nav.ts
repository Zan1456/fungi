import type { TranslationKey } from './i18n';

export interface NavItem {
  key: TranslationKey;
  /** Path relative to `/{locale}`, e.g. '/characters'. '/' means the locale root itself. */
  href: string;
  functional: boolean;
}

export interface NavGroup {
  key: TranslationKey;
  items: NavItem[];
}

export const navGroups: NavGroup[] = [
  {
    key: 'nav.overview',
    items: [{ key: 'nav.home', href: '/', functional: true }],
  },
  {
    key: 'nav.tools',
    items: [
      { key: 'nav.wish', href: '/wish', functional: true },
      { key: 'nav.calculator', href: '/calculator', functional: true },
    ],
  },
  {
    key: 'nav.database',
    items: [
      { key: 'nav.characters', href: '/characters', functional: true },
      { key: 'nav.weapons', href: '/weapons', functional: false },
      { key: 'nav.artifacts', href: '/artifacts', functional: false },
      { key: 'nav.items', href: '/items', functional: false },
    ],
  },
  {
    key: 'nav.trackers',
    items: [
      { key: 'nav.achievement', href: '/achievement', functional: false },
      { key: 'nav.tcg', href: '/tcg', functional: false },
      { key: 'nav.furnishing', href: '/furnishing', functional: false },
      { key: 'nav.fishing', href: '/fishing', functional: false },
      { key: 'nav.radiantSpincrystal', href: '/radiant-spincrystal', functional: false },
    ],
  },
  {
    key: 'nav.planning',
    items: [
      { key: 'nav.todo', href: '/todo', functional: false },
      { key: 'nav.timeline', href: '/timeline', functional: false },
      { key: 'nav.domains', href: '/domains', functional: false },
      { key: 'nav.banners', href: '/banners', functional: false },
      { key: 'nav.calendar', href: '/calendar', functional: false },
      { key: 'nav.reminder', href: '/reminder', functional: false },
    ],
  },
  {
    key: 'nav.site',
    items: [
      { key: 'nav.changelog', href: '/changelog', functional: true },
      { key: 'nav.settings', href: '/settings', functional: false },
    ],
  },
];

/** Every non-functional, routable section — used to generate the shared "coming soon" pages. */
export const comingSoonSections = navGroups
  .flatMap((group) => group.items)
  .filter((item) => !item.functional && item.href !== '/')
  .map((item) => ({ slug: item.href.replace(/^\//, ''), key: item.key }));
