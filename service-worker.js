
const CACHE_NAME = '3-minute-maths-v0.3';
const ASSETS = [
  '/',
  '/index.html',
  '/style.css',
  '/game.js',
  '/icon-192.png',
  '/icon-512.png',
  '/manifest.json',
  '/click.wav',
  '/cheer.wav',
  '/bonus.wav'


];


self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(ASSETS);
    })
  );
  self.skipWaiting();
});


self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.map(k => {
        if (k !== CACHE_NAME) return caches.delete(k);
      }))
    )
  );
  clients.claim();
});


self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(cached => {
      return cached || fetch(e.request);
    })
  );
});
