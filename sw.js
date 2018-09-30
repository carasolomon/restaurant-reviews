// Service Worker

const cacheName = 'restaurant-reviews-cache-v1';
const filesToCache = [
    '/',
    '/index.html',
    '/restaurant.html',
    '/js/dbhelper.js',
    '/js/main.js',
    '/js/restaurant_info.js',
    '/img/1.jpg',
    '/img/2.jpg',
    '/img/3.jpg',
    '/img/4.jpg',
    '/img/5.jpg',
    '/img/6.jpg',
    '/img/7.jpg',
    '/img/8.jpg',
    '/img/9.jpg',
    '/img/10.jpg',
    '/css/styles.css',
    '/data/restaurants.json'
];

// Install service worker
self.addEventListener('install', (event) => {
    console.log('Service worker installed');
    event.waitUntil(
     caches.open(cacheName).then( (cache) => {
         console.log('Cache opened');
         return cache.addAll(filesToCache);
     })
    );
});

// Activate service worker
self.addEventListener('activate', (event) => {
    console.log('Service worker activated');
    event.waitUntil(
        caches.keys().then((keyList) => {
            return Promise.all(keyList.map((key) => {
                if (key !== cacheName) {
                    console.log('Service worker removing old cache shell', key);
                    return caches.delete(key);
                }
            })
         )
      })
    )
});

// Cache & return responses
self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request).then( 
            (response) => {
                if (response) {
                    return response;
                }
                let fetchRequest = event.request.clone();

                return fetch(fetchRequest).then(
                    (response) => {
                        if(!response || response.status !== 200 || response.type !== 'basic') {
                            return response;
                        }

                        let responseToCache = response.clone();

                        caches.open(cacheName).then(
                            (cache) => {
                                cache.put(event.request, responseToCache);
                            });
                        return response;    
                    }
                );
            }
        )
    )
});



