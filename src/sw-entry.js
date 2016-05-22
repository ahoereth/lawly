/* global self */

/**
 * Hijack navigate events in order to respond using the main index.html
 * and handle routing from there.
 */
self.addEventListener('fetch', (e) => {
  const { url, mode } = e.request;

  // Only hijack navigate events.
  if (mode !== 'navigate') { return; }

  // Only hijack navigate events which do not go to seemingly valid file urls.
  const ext = ['js', 'html', 'eot', 'ttf', 'woff2?', 'jpg', 'png', 'gif'];
  if (!url.match(new RegExp(`\.(${ext.join('|')})\s*$`))) {
    e.request.url = self.__wpo.assets.main[0];
  }

  return;
});

// self.addEventListener('push', (e) => console.log('sw: push', e));
// self.addEventListener('install', (e) => console.log('sw: install', e));
// self.addEventListener('activate', (e) => console.log('sw: activate', e));
