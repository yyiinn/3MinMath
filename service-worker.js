self.addEventListener("install", e => {
  self.skipWaiting();
});

self.addEventListener("install", e => {
  e.waitUntil(
    caches.open("tables-game-cache").then(cache => {
      return cache.addAll([
        "./",
        "./index.html",
        "./style.css",
        "./game.js",
        "./manifest.json",
        "./click.wav",
        "./icon-192.png",
        "./icon-512.png"
      ]);
    })
  );
});

self.addEventListener("fetch", e => {
  e.respondWith(
    caches.match(e.request).then(response => {
      return response || fetch(e.request);
    })
  );
});

