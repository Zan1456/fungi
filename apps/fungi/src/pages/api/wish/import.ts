import type { APIRoute } from 'astro';

// This proxies Genshin's own wish-history export endpoint — the one the in-game "export wish
// history" webview calls. It requires no credentials of ours: the player generates a
// short-lived `authkey` themselves (in-game > Wish History > Export), pastes the resulting URL
// here, and we relay it server-side purely because the endpoint has no CORS headers for a
// direct browser call. Nothing is stored server-side; the key is only forwarded for this
// one request. This is the same mechanism every wish-tracking tool (including paimon.moe)
// uses. NOTE: the exact upstream host/path below is assembled from publicly documented
// behavior of this endpoint and has not been exercised against a live wish URL in this
// environment — verify against a real export URL and adjust `REGION_HOSTS` /
// `GACHA_LOG_PATH` if the upstream host has moved.

const REGION_HOSTS: Record<string, string> = {
  os_usa: 'https://public-operation-hk4e-sg.hoyoverse.com',
  os_euro: 'https://public-operation-hk4e-sg.hoyoverse.com',
  os_asia: 'https://public-operation-hk4e-sg.hoyoverse.com',
  os_cht: 'https://public-operation-hk4e-sg.hoyoverse.com',
  cn_gf01: 'https://hk4e-api.mihoyo.com',
  cn_qd01: 'https://hk4e-api.mihoyo.com',
};

const GACHA_LOG_PATH = '/gacha_info/api/getGachaLog';

// 100=beginners, 200=standard, 301/400=character event (400 is the newer dual-banner code),
// 302=weapon event, 500=chronicled wish.
const GACHA_TYPES = ['100', '200', '301', '400', '302', '500'] as const;

const MAX_PAGES_PER_TYPE = 50; // safety cap: 50 * 20 = 1000 pulls per banner type per request
const PAGE_SIZE = '20';
const REQUEST_DELAY_MS = 350; // be polite to a rate-limited upstream

interface RawWishRow {
  uid: string;
  gacha_type: string;
  item_id: string;
  count: string;
  time: string;
  name: string;
  lang: string;
  item_type: string;
  rank_type: string;
  id: string;
}

interface GachaLogResponse {
  retcode: number;
  message: string;
  data: { list: RawWishRow[] } | null;
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function parseWishUrl(rawUrl: string): URL {
  // Users may paste the full webcache URL (real params live after a `#/log` fragment) or an
  // already-bare query string — normalize both to a URL we can read searchParams from.
  const hashIndex = rawUrl.indexOf('#');
  const withoutHash = hashIndex === -1 ? rawUrl : rawUrl.slice(0, hashIndex);
  return new URL(withoutHash);
}

async function fetchPage(host: string, params: URLSearchParams, gachaType: string, endId: string): Promise<GachaLogResponse> {
  const query = new URLSearchParams(params);
  query.set('gacha_type', gachaType);
  query.set('size', PAGE_SIZE);
  query.set('end_id', endId);

  const res = await fetch(`${host}${GACHA_LOG_PATH}?${query.toString()}`, {
    headers: { accept: 'application/json' },
  });
  if (!res.ok) {
    throw new Error(`Upstream responded with HTTP ${res.status}`);
  }
  return (await res.json()) as GachaLogResponse;
}

export const POST: APIRoute = async ({ request }) => {
  let body: { url?: string };
  try {
    body = await request.json();
  } catch {
    return json({ error: 'invalid_json' }, 400);
  }

  if (!body.url) {
    return json({ error: 'missing_url' }, 400);
  }

  let parsed: URL;
  try {
    parsed = parseWishUrl(body.url);
  } catch {
    return json({ error: 'invalid_url' }, 400);
  }

  const authkey = parsed.searchParams.get('authkey');
  if (!authkey) {
    return json({ error: 'missing_authkey' }, 400);
  }
  const region = parsed.searchParams.get('region') ?? 'os_usa';
  const host = REGION_HOSTS[region] ?? REGION_HOSTS.os_usa;

  const baseParams = new URLSearchParams({
    authkey_ver: parsed.searchParams.get('authkey_ver') ?? '1',
    sign_type: parsed.searchParams.get('sign_type') ?? '2',
    auth_appid: 'webview_gacha',
    lang: parsed.searchParams.get('lang') ?? 'en',
    device_type: 'mobile',
    region,
    authkey,
    game_biz: parsed.searchParams.get('game_biz') ?? 'hk4e_global',
  });

  const rows: RawWishRow[] = [];

  try {
    for (const gachaType of GACHA_TYPES) {
      let endId = '0';
      for (let page = 0; page < MAX_PAGES_PER_TYPE; page++) {
        const result = await fetchPage(host, baseParams, gachaType, endId);
        if (result.retcode !== 0) {
          throw new Error(result.message || `Upstream retcode ${result.retcode}`);
        }
        const list = result.data?.list ?? [];
        if (list.length === 0) break;
        rows.push(...list);
        endId = list[list.length - 1].id;
        await sleep(REQUEST_DELAY_MS);
      }
    }
  } catch (err) {
    return json({ error: 'upstream_failed', message: err instanceof Error ? err.message : String(err) }, 502);
  }

  return json({ rows }, 200);
};

function json(body: unknown, status: number) {
  return new Response(JSON.stringify(body), { status, headers: { 'content-type': 'application/json' } });
}
