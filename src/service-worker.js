import toolbox from 'sw-toolbox';

/* global process */
toolbox.options.debug = (process.env.NODE_ENV !== 'production');

toolbox.precache([
  '/service-worker.js',
  '/index.html',
  '/app.js',
  '/web-worker.js',
  '/MaterialIcons-Regular.eot',
  '/MaterialIcons-Regular.ttf',
  '/MaterialIcons-Regular.woff',
  '/MaterialIcons-Regular.woff2',
]);

/* global Request */
toolbox.router.get('/(.*)', (request, values, options) => {
  return toolbox.networkFirst(request, values, options).catch(() => {
    return toolbox.cacheOnly(new Request('/index.html'), values, options);
  });
}, {
  origin: /localhost:8080/,
});

toolbox.router.any('/(.*)',  (request, values, options) => {
  return toolbox.networkFirst(request, values, options).catch((error) => {
    throw error;
  });
}, {
  origin: /localhost:3000/,
});
