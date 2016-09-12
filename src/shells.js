import fs from 'fs';
import { endsWith, trimEnd, trimStart } from 'lodash';
import { map, mapValues, flow, flattenDeep } from 'lodash/fp';

import ssr, { assets, prefixPath, stripPath } from './helpers/ssr';
import appcacheTemplate from './appcache.ejs';
import manifest from './manifest.json';


const join = a => b => `${trimEnd(a, '/')}/${trimStart(b, '/')}`;
const flatten = flow(map(map(i => i)), flattenDeep);
const notCssOrJS = str => !str.match(/js|css$/i);


// eslint-disable-next-line import/no-commonjs
module.exports = function render(locals, callback) {
  const { path, webpackStats: stats } = locals;

  if (endsWith(path, 'manifest.json')) {
    const imgPath = join(process.env.DIST_PATH)('static/img');
    fs.stat(imgPath, (err, fsStats) => {
      if (err || !fsStats.isDirectory()) {
        callback(err || `${imgPath} is not a directory`);
      } else {
        manifest.icons = fs.readdirSync(imgPath)
          .filter(f => f.match(/icon-\d{2,3}\.png$/))
          .map(join(prefixPath('img')))
          .map(src => ({ src, size: (/-(\d{2,3})\.png$/).exec(src)[1] }))
          .sort((a, b) => (b.size - a.size))
          .map(({ src, size }) => ({
            src, sizes: `${size}x${size}`, type: 'image/png',
          }));
        // callback(null, JSON.stringify(manifest, null, 2));
        callback(null, JSON.stringify(manifest));
      }
    });
  }


  if (endsWith(path, 'manifest.appcache')) {
    const externals = Object.keys(stats.compilation.assets).filter(notCssOrJS);
    const appcacheContents = appcacheTemplate({
      assets: [...flatten(assets), ...map(prefixPath, externals)],
      fallback: mapValues(prefixPath, {
        '/gesetze': 'gesetze.html',
        '/gesetz': 'gesetz.html',
        '/suche': 'home.html', // TODO: Needs shell.
        '/index.html': 'index.html',
      }),
    });
    callback(null, appcacheContents);
  }


  if (endsWith(path, '.html') || endsWith(path, '/')) {
    let location = stripPath(path.replace('.html', ''));
    location = location !== '/home' ? location : '/';
    ssr(location, { manifest })
      .then(rendered => callback(null, rendered))
      .catch(error => callback(error));
  }
};
