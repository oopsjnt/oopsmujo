// Nome do cache
const CACHE_NAME = 'oops-transportes-caramujo-v1';

// Arquivos a serem cacheados
const urlsToCache = [
  '/oopsmujo/',
  '/oopsmujo/index.html',
  '/oopsmujo/style.css',
  '/oopsmujo/script.js',
  '/oopsmujo/geo-service.js',
  '/oopsmujo/rating-service.js',
  '/oopsmujo/admin-service.js',
  '/oopsmujo/icons/icon-192x192.png',
  '/oopsmujo/icons/icon-512x512.png',
  '/oopsmujo/icons/default-profile.png',
  '/oopsmujo/icons/whatsapp.png'
];

// Instalação do service worker
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Cache aberto');
        return cache.addAll(urlsToCache);
      })
  );
});

// Ativação do service worker
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Interceptação de requisições
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Cache hit - retorna a resposta do cache
        if (response) {
          return response;
        }

        // Clone da requisição
        const fetchRequest = event.request.clone();

        return fetch(fetchRequest).then(
          response => {
            // Verifica se a resposta é válida
            if(!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            // Clone da resposta
            const responseToCache = response.clone();

            caches.open(CACHE_NAME)
              .then(cache => {
                // Não cachear requisições de API ou Firebase
                if (!event.request.url.includes('firebaseio.com') && 
                    !event.request.url.includes('googleapis.com') &&
                    !event.request.url.includes('nominatim.openstreetmap.org')) {
                  cache.put(event.request, responseToCache);
                }
              });

            return response;
          }
        );
      })
  );
});

// Lidar com notificações push
self.addEventListener('push', event => {
  const data = event.data.json();
  const options = {
    body: data.body,
    icon: '/oopsmujo/icons/icon-192x192.png',
    badge: '/oopsmujo/icons/icon-192x192.png',
    data: {
      url: data.url || '/oopsmujo/'
    }
  };

  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});

// Lidar com clique em notificações
self.addEventListener('notificationclick', event => {
  event.notification.close();
  
  event.waitUntil(
    clients.openWindow(event.notification.data.url)
  );
});
