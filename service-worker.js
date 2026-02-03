const CACHE_NAME = "app-shell-v6";
const APP_SHELL = [
  "/",
  "/index.html",
  "/style.css",
  "/script.js",
  "/manifest.json",
  "/icons/icon-192.png",
  "/icons/icon-512.png"
];

// �A�Z�b�g����i�K�v�ɉ����Ċg������OK�j
const ASSET_EXT = /\.(?:css|js|png|jpg|jpeg|svg|webp|ico|woff2?)$/i;

self.addEventListener("install", (event) => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE_NAME);
    const results = await Promise.allSettled(APP_SHELL.map((u) => cache.add(u)));
    results.forEach((result, i) => {
      if (result.status === "rejected") {
        console.warn("[sw] precache failed:", APP_SHELL[i], result.reason);
      }
    });
  })());
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

  // SPA�̃y�[�W�J�ځi�A�h���X�o�[�X�V/�����[�h�܂ށj�� network-first
  if (event.request.mode === "navigate") {
    event.respondWith((async () => {
      try {
        const fresh = await fetch(event.request);
        if (fresh && fresh.ok) {
          try {
            const cache = await caches.open(CACHE_NAME);
            await cache.put("/index.html", fresh.clone());
          } catch (e) {
            console.warn("[sw] cache.put index.html failed:", e);
          }
        }
        return fresh;
      } catch (e) {
        const cached = await caches.match("/index.html");
        if (cached) return cached;
        return new Response("Service Unavailable", {
          status: 503,
          statusText: "Service Unavailable",
          headers: { "Content-Type": "text/plain; charset=utf-8" }
        });
      }
    })());
    return;
  }

  const RUNTIME_CACHE_BYPASS = new Set([
    "/script.js",
    "/style.css",
    "/manifest.json"
  ]);

  // �摜�ECSS�EJS�Ȃǂ̃A�Z�b�g�� cache-first
  if (ASSET_EXT.test(url.pathname) && !RUNTIME_CACHE_BYPASS.has(url.pathname)) {
    event.respondWith((async () => {
      const cached = await caches.match(event.request);
      if (cached) return cached;

      const res = await fetch(event.request);

      // 同一オリジンで成功したものだけ保存
      if (res && res.ok && res.type === "basic") {
        try {
          const cache = await caches.open(CACHE_NAME);
          await cache.put(event.request, res.clone());
        } catch (e) {
          console.warn("[sw] cache.put failed:", url.pathname, e);
        }
      }
      return res;
    })());
    return;
  }



  // ����ȊO�i������API���j�͑f�ʂ��i�L���b�V�����Ȃ��j
});

self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SKIP_WAITING") {
    self.skipWaiting();
  }
});
