// Service Worker for PWA functionality
const CACHE_NAME = 'condominio-app-v1';
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/resident.html',
  '/admin.html',
  '/assets/css/auth.css',
  '/assets/css/resident.css',
  '/assets/css/admin.css',
  '/assets/js/auth.js',
  '/assets/js/resident.js',
  '/assets/js/admin.js',
  '/assets/images/logo-premium.png',
  '/assets/images/logo-white.png',
  '/assets/images/user-avatar.jpg',
  '/assets/images/admin-avatar.jpg',
  '/assets/images/lost-item1.jpg',
  '/assets/images/lost-item2.jpg',
  '/assets/images/lost-item3.jpg',
  '/assets/images/sample-qrcode.png',
  '/assets/images/qrcode-pix.png',
  'https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css',
  'https://cdnjs.cloudflare.com/ajax/libs/animate.css/4.1.1/animate.min.css',
  'https://cdnjs.cloudflare.com/ajax/libs/fullcalendar/5.11.3/main.min.css',
  'https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/jquery/3.6.0/jquery.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.29.1/moment.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/fullcalendar/5.11.3/main.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        return cache.addAll(ASSETS_TO_CACHE);
      })
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        return response || fetch(event.request);
      })
  );
});

self.addEventListener('activate', (event) => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});