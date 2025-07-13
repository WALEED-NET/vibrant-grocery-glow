
const CACHE_NAME = 'smart-grocery-v1.4.0'; // Updated version for new icon
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json'
];

// تثبيت Service Worker
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('✅ Opened cache');
        return cache.addAll(urlsToCache).catch((error) => {
          console.log('Cache addAll failed:', error);
          return Promise.resolve();
        });
      })
  );
});

// الاستماع لرسالة من العميل لتخطي الانتظار
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

// تحديث Service Worker وحذف الكاش القديم
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('🗑️ Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      ).then(() => {
        console.log('✅ Service Worker activated with new app icon');
        return self.clients.claim();
      });
    })
  );
});

// استلام الطلبات مع تحسين للشاشة الترحيبية
self.addEventListener('fetch', (event) => {
  // تحسين خاص للشاشة الرئيسية والموارد الحرجة
  if (event.request.mode === 'navigate' || event.request.url.includes('index.html')) {
    event.respondWith(
      fetch(event.request)
        .then(response => {
          // تخزين النسخة الجديدة في الكاش
          const responseToCache = response.clone();
          caches.open(CACHE_NAME).then(cache => {
            cache.put(event.request, responseToCache);
          });
          return response;
        })
        .catch(() => {
          // استخدام الكاش عند عدم توفر الاتصال
          return caches.match(event.request).then(cachedResponse => {
            return cachedResponse || caches.match('/');
          });
        })
    );
  } else {
    // إستراتيجية "Cache First" للملفات الأخرى
    event.respondWith(
      caches.match(event.request)
        .then((response) => {
          if (response) {
            return response;
          }
          return fetch(event.request).then(fetchResponse => {
            // تخزين الموارد الجديدة في الكاش
            const responseToCache = fetchResponse.clone();
            caches.open(CACHE_NAME).then(cache => {
              cache.put(event.request, responseToCache);
            });
            return fetchResponse;
          });
        })
        .catch(() => {
          // Fallback for offline scenarios
          return caches.match('/');
        })
    );
  }
});
