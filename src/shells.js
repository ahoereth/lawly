import fs from 'fs';
import path from 'path';
import React from 'react';
import { renderToString } from 'react-dom/server';
import { match, createMemoryHistory } from 'react-router';
import { syncHistoryWithStore } from 'react-router-redux';
import { endsWith, partialRight, trimEnd, trimStart } from 'lodash';
import { map, mapValues, flow, flattenDeep } from 'lodash/fp';

import createStore from './store/createStore';
import ApiClient from './helpers/ApiClient';
import AppHtml from './components/AppHtml';
import AppServer from './components/AppServer';
import routes from './routes';
import settle from './helpers/settle';
import { fetchLawIndex } from './modules/law_index';
import { renderShells } from './modules/core';
import appcacheTemplate from './appcache.ejs';


const publicPath = process.env.PUBLIC_PATH;
const readFile = partialRight(fs.readFileSync, 'utf8');
const toArray = e => (Array.isArray(e) ? e : [e]);
const toArrays = mapValues(toArray);
const join = a => b => `${trimEnd(a, '/')}/${trimStart(b, '/')}`;
const prefixPublicPath = map(join(publicPath));
const flatten = flow(map(map(i => i)), flattenDeep);
const notCssOrJS = str => !str.match(/js|css$/i);


const ASSETS_PATH = path.resolve(process.env.DIST_PATH, 'assets.json');
const client = new ApiClient(process.env.APIURL);
const assets = flow(readFile, JSON.parse)(ASSETS_PATH);
assets['web-worker'].js = assets['web-worker'].js.slice(publicPath.length - 1);
const { js, css } = toArrays(assets.app);
const manifest = '/manifest.json';
const appcache = '/manifest.appcache';


// eslint-disable-next-line import/no-commonjs
module.exports = function render(locals, callback) {
  const { path, webpackStats: stats } = locals;

  if (endsWith(path, 'manifest.appcache')) {
    const externals = Object.keys(stats.compilation.assets).filter(notCssOrJS);
    const appcacheContents = appcacheTemplate({
      assets: [manifest, ...flatten(assets), ...prefixPublicPath(externals)],
      fallback: {
        '/gesetze': '/gesetze.html',
        '/gesetz': '/gesetz.html',
        '/suche': '/home.html', // TODO: Needs shell.
        '/': '/home.html',
      },
    });
    callback(null, appcacheContents);
  }

  let location = path.replace('.html', '');
  location = location !== '/home' ? location : '/';
  const memoryHistory = createMemoryHistory(location);
  const store = createStore(memoryHistory, client, {});
  const history = syncHistoryWithStore(memoryHistory, store, {
    selectLocationState: state => state.get('routing'),
  });
  match({ history, routes, location }, (error, redirect, props) => {
    if (error) {
      throw new Error(error.message);
    }

    if (redirect) {
      const { pathname, search } = redirect;
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
          manifest={manifest}
        >
          <AppServer renderProps={props} store={store} />
        </AppHtml>
      );

      callback(null, `<!doctype html>\n${page}\n`);
    });
  });
};
