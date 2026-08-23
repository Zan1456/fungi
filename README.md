# Fungi.moe

Genshin Impact companion tools — Wish Counter, Character Database, and an ascension/talent
Calculator today, with more tools (Todo, Timeline, Achievements, TCG, and eventually an
interactive map) planned. Built with [Astro](https://astro.build) + React islands, styled
after [vercel.com](https://vercel.com)'s design language.

Not affiliated with HoYoverse. Genshin Impact, game content and materials are trademarks and
copyrights of HoYoverse. Character/weapon/item data is ported from
[paimon.moe](https://github.com/MadeBaruna/paimon-moe) (MIT) — see
[`apps/fungi/src/data/vendor/THIRD_PARTY_NOTICES.md`](apps/fungi/src/data/vendor/THIRD_PARTY_NOTICES.md).

## Repo layout

This is a pnpm workspace:

```
apps/
  fungi/     the site (this is what you run)
  map/       reserved for a future interactive-map project — not built yet
packages/
  ui/        shared design system (Button, Card, Badge, icons, ...), consumed as raw
             .astro/.tsx source, no build step of its own
  config/    shared tsconfig preset
```

## Getting started

Requires Node.js 20+ and [pnpm](https://pnpm.io).

```sh
pnpm install
pnpm dev       # http://localhost:4321
pnpm build     # production build (needs a Linux/Vercel environment to finish fully — see below)
```

### Windows local build note

`pnpm build` runs to completion and prerenders every page correctly, but the very last step
(the Vercel adapter bundling the server function) fails locally on Windows with an `EPERM`
symlink error — Windows blocks unprivileged symlink creation unless **Developer Mode** is
enabled in Settings, or the shell runs elevated. This does not affect `pnpm dev`, and it will
not happen on Vercel's own (Linux) build servers when you actually deploy.

### Fetching real icons

Character/weapon/item art isn't bundled with the repo (HoYoverse's own assets aren't ours to
redistribute). Run this once (or whenever you add new data) to populate `public/images/`:

```sh
pnpm --filter fungi fetch:assets
```

This pulls icons from [Project Amber / Project Yatta](https://gi.yatta.moe), a public Genshin
data API built for third-party fan-tool consumption, matched to our data by English name. It's
safe to re-run — existing files are skipped, and unmatched/missing icons are just logged (the
UI falls back to `public/images/placeholder.svg`, never a broken image).

## What's implemented (Phase 1)

- **Wish Counter** (`/wish`) — paste a wish-history export URL for automatic import (proxied
  server-side via `src/pages/api/wish/import.ts`, since that endpoint has no CORS headers for
  a direct browser call — see the comment at the top of that file, including the caveat that
  its exact upstream host/path is unverified against a live URL in this environment), plus
  manual entry and JSON export/import for backup. Pity counters and a pulls-per-5★ chart.
- **Character Database** (`/characters`) — every character from the ported dataset, filterable
  by name/element/weapon, with a detail page showing stats, ascension materials, and talent
  materials.
- **Calculator** (`/calculator`) — add characters to a planner, set current/target ascension
  and talent levels, get an aggregated material + mora total.

Every other paimon.moe-style section (Weapons, Artifacts, Achievements, TCG, Todo, Timeline,
Domains, Banners, …) has a real nav entry and route, marked "coming soon" — see
`src/lib/nav.ts` for the single source of truth the sidebar, mobile menu, and the shared
`[locale]/[section].astro` stub route all read from.

## i18n

Hungarian (`hu`, default) and English (`en`), routed as `/hu/...` / `/en/...`. Translation
strings live in `src/i18n/{locale}/*.json`, one JSON file per module, merged in `src/lib/i18n.ts`.
Character/weapon/item proper names are intentionally left untranslated (same as paimon.moe).
