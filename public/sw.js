const CACHE_NAME = "blendin-offline-v1";
const APP_SHELL = [
  "/",
  "/index.html",
  "/site.webmanifest",
  "/favicon.svg",
  "/brand-logo.svg",
  "/brand-logo.png",
  "/icon-192.png",
  "/icon-512.png",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(async (cache) => {
      await cache.addAll(APP_SHELL);

      // Vite adds content hashes to production JS and CSS filenames. Discover
      // and cache those files now so the first completed visit is enough.
      const response = await fetch("/index.html", { cache: "no-store" });
      const html = await response.clone().text();
      await cache.put("/index.html", response);
      const generatedAssets = [...html.matchAll(/(?:src|href)="(\/[^\"]+)"/g)]
        .map((match) => match[1])
        .filter((path) => path.startsWith("/assets/"));
      await Promise.all(generatedAssets.map((path) => cache.add(path)));
    }).then(() => self.skipWaiting()),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))))
      .then(() => self.clients.claim()),
  );
});

const cacheResponse = async (request, response) => {
  if (response && response.ok) {
    const cache = await caches.open(CACHE_NAME);
    await cache.put(request, response.clone());
  }
  return response;
};

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request)
        .then((response) => cacheResponse(request, response))
        .catch(async () => (await caches.match(request)) || (await caches.match("/index.html")) || caches.match("/")),
    );
    return;
  }

  event.respondWith(
    caches.match(request).then((cached) => {
      const update = fetch(request)
        .then((response) => cacheResponse(request, response))
        .catch(() => cached);
      return cached || update;
    }),
  );
});
