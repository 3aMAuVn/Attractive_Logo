// Versioned PWA cache. Online pages are network-first so installed apps update with GitHub Pages.
const CACHE_NAME = "magic-math-master-20261110-start-free-v3";
const APP_SHELL = ["/", "/index.html", "/manifest.json", "/assets/logo.png", "/assets/icon-192.png", "/assets/icon-512.png"];
self.addEventListener("install", event => {
  self.skipWaiting();
  event.waitUntil(caches.open(CACHE_NAME).then(cache => Promise.all(APP_SHELL.map(url => cache.add(url).catch(() => null)))));
});
self.addEventListener("activate", event => {
  event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key)))).then(() => self.clients.claim()));
});
self.addEventListener("fetch", event => {
  const req = event.request;
  if (req.method !== "GET" || new URL(req.url).origin !== self.location.origin) return;
  event.respondWith((async () => {
    const cache = await caches.open(CACHE_NAME);
    try {
      // Always prefer fresh pages and assets when online; update offline copy.
      const response = await fetch(req);
      if (response.ok) cache.put(req, response.clone()).catch(() => {});
      return response;
    } catch (err) {
      return (await cache.match(req)) || (req.mode === "navigate" ? await cache.match("/index.html") : undefined) || Response.error();
    }
  })());
});
