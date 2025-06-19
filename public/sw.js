
const CACHE_NAME = 'smart-grocery-v1.2.6'; // تحديث إصدار الكاش لضمان التحديث
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  '/lovable-uploads/b0f53d14-5d80-496a-910c-5ae4198a8231.png'
];

// تثبيت Service Worker
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
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
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      ).then(() => self.clients.claim()); // السيطرة على العملاء المفتوحين
    })
  );
});

// استلام الطلبات (Network first for navigation, Cache first for others)
self.addEventListener('fetch', (event) => {
  // إستراتيجية "Network First" لطلبات التنقل (الصفحة الرئيسية)
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request)
        .then(response => {
          // إذا نجح الطلب من الشبكة، قم بتخزين النسخة الجديدة في الكاش
          // هذا يضمن أن الوضع غير المتصل بالإنترنت سيستخدم أحدث إصدار متاح
          const responseToCache = response.clone();
          caches.open(CACHE_NAME).then(cache => {
            cache.put(event.request, responseToCache);
          });
          return response;
        })
        .catch(() => {
          // إذا فشل الطلب من الشبكة (المستخدم غير متصل)، حاول جلب الملف من الكاش
          return caches.match(event.request);
        })
    );
  } else {
    // إستراتيجية "Cache First" للملفات الأخرى (CSS, JS, images)
    event.respondWith(
      caches.match(event.request)
        .then((response) => {
          // إرجاع الاستجابة من الكاش إذا وُجدت، وإلا اطلبها من الشبكة
          return response || fetch(event.request);
        })
    );
  }
});
