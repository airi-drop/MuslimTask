/*
 * MuslimTask Service Worker
 *
 * Strategy:
 *   - HTML pages: network-first, fallback to cache, then offline page
 *   - Static assets (_next/static, fonts, images): cache-first
 *   - JSON / API calls: network-first with cache fallback
 *   - Activate cleans up old cache versions
 */

const VERSION = "v1.1.0";
const CACHE_HTML = `mt-html-${VERSION}`;
const CACHE_STATIC = `mt-static-${VERSION}`;
const CACHE_DATA = `mt-data-${VERSION}`;

const PRECACHE_URLS = [
  "/",
  "/quest",
  "/tasbih",
  "/statistik",
  "/achievement",
  "/mihrab",
  "/mihrab/quran",
  "/mihrab/doa",
  "/mihrab/dzikir",
  "/offline",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(CACHE_HTML);
      await Promise.all(
        PRECACHE_URLS.map(async (url) => {
          try {
            const res = await fetch(url, { cache: "no-cache" });
            if (res.ok) await cache.put(url, res);
          } catch (e) {
            // ignore failures during precache; runtime cache will fill in
          }
        }),
      );
      // Don't skipWaiting() automatically — let user reload to upgrade.
    })(),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(
        keys
          .filter(
            (k) =>
              k.startsWith("mt-") &&
              ![CACHE_HTML, CACHE_STATIC, CACHE_DATA].includes(k),
          )
          .map((k) => caches.delete(k)),
      );
      await self.clients.claim();
    })(),
  );
});

function isHtmlRequest(req) {
  return (
    req.mode === "navigate" ||
    (req.method === "GET" &&
      (req.headers.get("accept") || "").includes("text/html"))
  );
}

function isStaticAsset(url) {
  return (
    url.pathname.startsWith("/_next/static/") ||
    url.pathname.startsWith("/_next/image") ||
    url.pathname.match(/\.(?:js|css|woff2?|ttf|otf|png|jpe?g|svg|webp|ico)$/i)
  );
}

self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET") return;

  const url = new URL(req.url);

  // Allow caching of equran.id Quran API for offline reading.
  if (url.host === "equran.id") {
    event.respondWith(staleWhileRevalidate(req, CACHE_DATA));
    return;
  }

  // Cache audio from cdn.equran.id with cacheFirst (audio is static).
  if (url.host === "cdn.equran.id") {
    event.respondWith(cacheFirst(req, CACHE_STATIC));
    return;
  }

  if (url.origin !== self.location.origin) return; // skip other cross-origin

  // Don't cache the manifest (let it always be fresh) or RSC payloads
  if (url.pathname === "/manifest.webmanifest") return;
  if (url.searchParams.has("_rsc")) return;

  if (isHtmlRequest(req)) {
    event.respondWith(networkFirst(req, CACHE_HTML, "/offline"));
    return;
  }

  if (isStaticAsset(url)) {
    event.respondWith(cacheFirst(req, CACHE_STATIC));
    return;
  }

  // Default: network-first for anything else (data/JSON).
  event.respondWith(networkFirst(req, CACHE_DATA));
});

async function networkFirst(req, cacheName, offlineFallbackPath) {
  const cache = await caches.open(cacheName);
  try {
    const fresh = await fetch(req);
    if (fresh.ok) cache.put(req, fresh.clone());
    return fresh;
  } catch (err) {
    const cached = await cache.match(req);
    if (cached) return cached;
    if (offlineFallbackPath) {
      const fallback = await caches.match(offlineFallbackPath);
      if (fallback) return fallback;
    }
    return new Response("Offline", { status: 503, statusText: "Offline" });
  }
}

async function cacheFirst(req, cacheName) {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(req);
  if (cached) return cached;
  try {
    const fresh = await fetch(req);
    if (fresh.ok) cache.put(req, fresh.clone());
    return fresh;
  } catch (err) {
    return new Response("", { status: 504 });
  }
}

async function staleWhileRevalidate(req, cacheName) {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(req);
  const fetchPromise = fetch(req)
    .then((fresh) => {
      if (fresh.ok) cache.put(req, fresh.clone());
      return fresh;
    })
    .catch(() => null);
  return cached || (await fetchPromise) || new Response("", { status: 504 });
}

self.addEventListener("message", (event) => {
  if (event.data === "SKIP_WAITING") self.skipWaiting();
});
