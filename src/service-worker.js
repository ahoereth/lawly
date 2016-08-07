const STATICS = [
  '/service-worker.js',
  '/index.html',
  '/app.js',
  '/web-worker.js',
  '/MaterialIcons-Regular.eot',
  '/MaterialIcons-Regular.ttf',
  '/MaterialIcons-Regular.woff',
  '/MaterialIcons-Regular.woff2',
];

(sw => {
  const { caches, fetch } = sw;
  const STATICS_CACHE = 'statics';

  function log(...args) {
    console.log('[SW]', ...args);
  }

  sw.addEventListener('install', event => {
    log('install');
    event.waitUntil(
      caches.open(STATICS_CACHE)
        .then(cache => cache.addAll(STATICS))
        .then(() => sw.skipWaiting())
    );
  });

  self.addEventListener('fetch', event => {
    const response = caches.match(event.request).then(response => {
      const request = event.request;
      const origin = self.location.origin;

      if (response) {
        log('from cache: ', request.url);
        return response;
      } else {
        log('try remote: ', request.url);
        return fetch(request).catch(() => {
          if (request.url.indexOf(origin) > -1) {
            log('redirect to /: ', request.url);
            return fetch('/index.html').then(() => caches.match('/index.html'));
          }
        });
      }
    });

    event.respondWith(response);
  });

  self.addEventListener('activate', event => {
    log('activate');
    event.waitUntil(sw.clients.claim());
  });
})(self); /* global self */
