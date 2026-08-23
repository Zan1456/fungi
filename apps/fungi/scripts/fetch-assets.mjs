#!/usr/bin/env node
// Downloads real character/weapon/item icons from Project Amber / Project Yatta
// (https://gi.yatta.moe), a public Genshin Impact data API explicitly built for
// third-party fan-tool consumption, matched against our vendored paimon.moe data by
// English display name. This does NOT scrape HoYoverse's own CDN directly.
//
// Run manually: `pnpm fetch:assets` from apps/fungi (or `pnpm fetch:assets` from the repo
// root). Never runs automatically on install/build. Safe to re-run — it skips files that
// already exist, and any lookup that fails (no name match, or a 404 on the asset itself) is
// logged and skipped rather than aborting the whole run; a missing icon just means the app's
// ElementIcon/WeaponIcon/ItemIcon components keep falling back to placeholder.svg.
//
// Source/attribution: Project Amber / Project Yatta (https://gi.yatta.moe). Not affiliated
// with Fungi.moe. Genshin Impact assets referenced here are trademarks/copyrights of
// HoYoverse.

import { mkdir, writeFile, access } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { characters } from '../src/data/vendor/characters.js';
import { weaponList } from '../src/data/vendor/weaponList.js';
import { itemList } from '../src/data/vendor/itemList.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PUBLIC_IMAGES_DIR = path.resolve(__dirname, '../public/images');

const API_BASE = 'https://gi.yatta.moe/api/v2/en';
const ASSET_BASE = 'https://gi.yatta.moe/assets/UI';
const REQUEST_DELAY_MS = 150;

function normalizeName(name) {
  return name.toLowerCase().replace(/[^a-z0-9]/g, '');
}

async function fetchJson(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status} fetching ${url}`);
  return res.json();
}

async function fileExists(filePath) {
  try {
    await access(filePath);
    return true;
  } catch {
    return false;
  }
}

async function downloadIcon(iconName, destPath, subfolder = '') {
  if (await fileExists(destPath)) return 'skipped';
  const res = await fetch(`${ASSET_BASE}/${subfolder}${iconName}.png`);
  if (!res.ok) return 'missing';
  const buffer = Buffer.from(await res.arrayBuffer());
  await mkdir(path.dirname(destPath), { recursive: true });
  await writeFile(destPath, buffer);
  return 'downloaded';
}

/** Builds a normalized-name -> icon-name lookup from one Yatta list endpoint. */
async function buildNameIndex(endpoint) {
  const json = await fetchJson(`${API_BASE}/${endpoint}`);
  const index = new Map();
  for (const item of Object.values(json.data.items)) {
    if (!item.name || !item.icon) continue;
    index.set(normalizeName(item.name), item.icon);
  }
  return index;
}

async function run() {
  console.log('Fetching Project Amber/Yatta name indexes…');
  const [avatarIndex, weaponIndex, materialIndex] = await Promise.all([
    buildNameIndex('avatar'),
    buildNameIndex('weapon'),
    buildNameIndex('material'),
  ]);

  const stats = { downloaded: 0, skipped: 0, missing: 0 };

  async function process(id, name, iconIndex, destDir, subfolder = '') {
    const icon = iconIndex.get(normalizeName(name));
    if (!icon) {
      stats.missing++;
      console.log(`  [no match] ${name} (${id})`);
      return;
    }
    const dest = path.join(PUBLIC_IMAGES_DIR, destDir, `${id}.png`);
    const result = await downloadIcon(icon, dest, subfolder);
    stats[result]++;
    if (result === 'downloaded') console.log(`  [ok] ${name}`);
    if (result === 'missing') console.log(`  [404] ${name} (icon ${icon})`);
    await new Promise((resolve) => setTimeout(resolve, REQUEST_DELAY_MS));
  }

  const characterList = Object.values(characters);
  console.log(`\nCharacters (${characterList.length})…`);
  for (const c of characterList) {
    await process(c.id, c.name, avatarIndex, 'characters');
  }

  const weapons = Object.values(weaponList);
  console.log(`\nWeapons (${weapons.length})…`);
  for (const w of weapons) {
    await process(w.id, w.name, weaponIndex, 'weapons');
  }

  const items = Object.values(itemList).filter((i) => i.name && i.id !== 'none' && i.id !== 'unknown');
  console.log(`\nItems (${items.length})…`);
  for (const i of items) {
    await process(i.id, i.name, materialIndex, 'items');
  }

  console.log(`\nDone. downloaded=${stats.downloaded} skipped=${stats.skipped} missing=${stats.missing}`);
  console.log('Source: Project Amber / Project Yatta (https://gi.yatta.moe).');
}

run().catch((err) => {
  console.error('fetch-assets failed:', err);
  process.exitCode = 1;
});
