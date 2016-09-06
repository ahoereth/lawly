import fs from 'fs';
import React from 'react';
import { renderToString } from 'react-dom/server';
import { match, createMemoryHistory } from 'react-router';
import { syncHistoryWithStore } from 'react-router-redux';
import { endsWith, partialRight, trimEnd, trimStart } from 'lodash';
import { map, mapValues, flow, flattenDeep } from 'lodash/fp';
import manup from 'manup';

import createStore from './store/createStore';
import ApiClient from './helpers/ApiClient';
import AppHtml from './components/AppHtml';
import AppServer from './components/AppServer';
import routes from './routes';
import settle from './helpers/settle';
import { fetchLawIndex } from './modules/law_index';
import { renderShells } from './modules/core';
import appcacheTemplate from './appcache.ejs';
import manifest from './manifest.json';


const publicPath = process.env.PUBLIC_PATH;
const readJSON = flow(partialRight(fs.readFileSync, 'utf8'), JSON.parse);
const toArray = e => (Array.isArray(e) ? e : [e]);
const toArrays = mapValues(toArray);
const join = a => b => `${trimEnd(a, '/')}/${trimStart(b, '/')}`;
const prefixPath = join(publicPath);
const stripPath = str => str.slice(publicPath.length - 1);
const flatten = flow(map(map(i => i)), flattenDeep);
const notCssOrJS = str => !str.match(/js|css$/i);


let appcache; // Value comes from webpack config, should be first static.

const ASSETS_PATH = join(process.env.DIST_PATH)('assets.json');
const client = new ApiClient(process.env.APIURL);
const assets = readJSON(ASSETS_PATH);
const { js, css } = toArrays(assets.app);


// eslint-disable-next-line import/no-commonjs
module.exports = function render(locals, callback) {
  const { path, webpackStats: stats } = locals;

  if (endsWith(path, 'manifest.json')) {
    const images = fs.readdirSync(join(process.env.DIST_PATH)('static/img'));
    manifest.icons = images
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


  if (endsWith(path, 'manifest.appcache')) {
    appcache = path;
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


  let location = stripPath(path.replace('.html', ''));
  location = location !== '/home' ? location : '/';
  const memoryHistory = createMemoryHistory(location);
  const store = createStore(memoryHistory, client, {});
  const history = syncHistoryWithStore(memoryHistory, store, {
    selectLocationState: state => state.get('routing'),
  });
  match({ history, routes, location, basename: '/' }, (err, re, props) => {
    if (err) {
      throw new Error(err.message);
    }

    if (re) {
      const { pathname, search } = re;
      throw new Error(`Redirect to ${pathname}${search}`);
    }

    if (!props) {
      throw new Error(`404: Not found: ${path}`);
    }

    store.dispatch(renderShells(true));
    const asyncDeps = [
      store.dispatch(fetchLawIndex({ limit: true, cachable: false })),
    ];

    Promise.all(asyncDeps.map(settle)).then(() => {
      const page = renderToString(
        <AppHtml
          appcache={appcache}
          assets={assets}
          js={js}
          css={css}
          state={store.getState()}
          manifest={prefixPath('/manifest.json')}
          meta={manup(manifest)}
          title={manifest.short_name}
        >
          <AppServer renderProps={props} store={store} />
        </AppHtml>
      );

      callback(null, `<!doctype html>\n${page}\n`);
    });
  });
};
