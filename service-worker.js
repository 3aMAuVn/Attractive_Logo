// Magic Math Master PWA service worker: network-only safe mode.
// Prevent outdated cached HTML from hiding newly deployed website changes.
// Offline navigation is intentionally disabled until a reliable offline strategy is introduced.
const CACHE_VERSION = "mmm-network-only-20261110-v1";

self.addEventListener("install", event => {
  self.skipWaiting();
});

self.addEventListener("activate", event => {
  event.waitUntil((async () => {
    // Remove caches left by earlier versions of the Magic Math Master PWA.
    const keys = await caches.keys();
    await Promise.all(keys.filter(key => key.startsWith("magic-math-master-") || key.startsWith("mmm-")).map(key => caches.delete(key)));
    await self.clients.claim();
  })());
});

self.addEventListener("fetch", event => {
  // Do not intercept requests: the browser obtains the latest website files
  // directly from the network, using ordinary HTTP cache rules.
});
