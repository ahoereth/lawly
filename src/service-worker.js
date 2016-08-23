import toolbox from 'sw-toolbox';

const { Request, Response } = self; /* global self */

// TODO: Outdated.
// Consider using https://github.com/oliviertassinari/serviceworker-webpack-plugin
const statics = [
  '/service-worker.js',
  '/index.html',
  '/app.js',
  '/web-worker.js',
  '/manifest.json',
];
const exts = statics.map(name => name.slice(name.lastIndexOf('.')));
const extRegex = new RegExp(`(${exts.join('|')})$`, 'i');


// Cache static assets.
toolbox.precache(statics);


// Enable debug mode and suppress sockjs-node request errors.
if (process.env.NODE_ENV !== 'production') { /* global process */
  toolbox.options.debug = true;

  toolbox.router.get('/sockjs-node/*', (request, values, options) => (
    toolbox.networkOnly(request, values, options).catch(() => new Response())
  ));
}


// Redirect SPA subroute requests to index.
toolbox.router.get('/*', (request, values, options) => {
  // Do not redirect static asset requests.
  if (request.url.match(extRegex)) {
    // TODO: Maybe use `fastest` when in production for faster app startup?
    return toolbox.networkFirst(request, values, options)
                  .catch(() => new Response());
  }

  // TODO: Maybe use `fastest` here? Why rely on the server for route redirects?
  return toolbox.networkFirst(request, values, options).catch(() => (
    toolbox.cacheOnly(new Request('/index.html'), values, options)
           .catch(() => new Response())
  ));
}, {
  origin: /localhost:8080$/,
  cache: {
    name: 'statics',
  },
});


// Cache Google fonts and icons.
// TODO: Maybe use `cacheFirst` with additional `cache.maxAgeSeconds` here in
// order to not fire off network requests to Google on every startup?
toolbox.router.get('/*', toolbox.fastest, {
  origin: /\.(googleapis|gstatic)\.com$/,
  cache: {
    name: 'googleapis',
  },
});
