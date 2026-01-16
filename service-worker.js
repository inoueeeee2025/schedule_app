const CACHE_NAME = "app-shell-v1";
const APP_SHELL = [
  "/",
  "/index.html",
  "/style.css",
  "/script.js",
  "/manifest.json",
  "/icons/icon-192.png",
  "/icons/icon-512.png"
];

// アセット判定（必要に応じて拡張してOK）
const ASSET_EXT = /\.(?:css|js|png|jpg|jpeg|svg|webp|ico|woff2?)$/i;

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_SHELL)));
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;

  const url = new URL(event.request.url);
  if (url.origin !== self.location.origin) return;

  // SPAのページ遷移（アドレスバー更新/リロード含む）は network-first
  if (event.request.mode === "navigate") {
    event.respondWith((async () => {
      try {
        const fresh = await fetch(event.request);
        const cache = await caches.open(CACHE_NAME);
        cache.put("/index.html", fresh.clone());
        return fresh;
      } catch {
        return (await caches.match("/index.html")) || new Response("Offline", { status: 503 });
      }
    })());
    return;
  }

  // 画像・CSS・JSなどのアセットは cache-first
  if (ASSET_EXT.test(url.pathname)) {
    event.respondWith((async () => {
      const cached = await caches.match(event.request);
      if (cached) return cached;

      const res = await fetch(event.request);
      if (res && res.ok) {
        const cache = await caches.open(CACHE_NAME);
        cache.put(event.request, res.clone());
      }
      return res;
    })());
    return;
  }

  // それ以外（将来のAPI等）は素通し（キャッシュしない）
});

self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SKIP_WAITING") {
    self.skipWaiting();
  }
});
