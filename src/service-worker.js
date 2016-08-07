import toolbox from 'sw-toolbox';

/* global process */
toolbox.options.debug = (process.env.NODE_ENV !== 'production');

toolbox.precache([
  '/service-worker.js',
  '/index.html',
  '/app.js',
  '/web-worker.js',
  '/manifest.json',
]);

/* global Request */
toolbox.router.get('/(.*)', (request, values, options) => {
  return toolbox.networkFirst(request, values, options).catch(() => {
    return toolbox.cacheOnly(new Request('/index.html'), values, options);
  });
}, {
  origin: /localhost:8080$/,
});

toolbox.router.any('/(.*)', toolbox.networkOnly, {
  origin: /localhost:3000$/,
});


toolbox.router.get('/(.*)', toolbox.cacheFirst, {
  origin: /\.(googleapis|gstatic)\.com$/,
  cache: {
    name: 'googleapis',
  },
});
