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


const publicPath = process.env.PUBLIC_PATH;
const readFile = partialRight(fs.readFileSync, 'utf8');
const toArray = e => (Array.isArray(e) ? e : [e]);
const toArrays = mapValues(toArray);
const join = a => b => `${trimEnd(a, '/')}/${trimStart(b, '/')}`;
const prefixPath = join(publicPath);
const stripPath = str => str.slice(publicPath.length - 1);
const flatten = flow(map(map(i => i)), flattenDeep);
const notCssOrJS = str => !str.match(/js|css$/i);


const manifest = prefixPath('/manifest.json');
let appcache; // Value comes from webpack config, should be first static.

const ASSETS_PATH = join(process.env.DIST_PATH)('assets.json');
const client = new ApiClient(process.env.APIURL);
const assets = flow(readFile, JSON.parse)(ASSETS_PATH);
const { js, css } = toArrays(assets.app);

const MANIFEST_PATH = join(process.env.DIST_PATH)(manifest);
const manifestObj = JSON.parse(readFile(MANIFEST_PATH));
const meta = manup(manifestObj);


// eslint-disable-next-line import/no-commonjs
module.exports = function render(locals, callback) {
  const { path, webpackStats: stats } = locals;

  if (endsWith(path, 'manifest.appcache')) {
    appcache = path;
    const externals = Object.keys(stats.compilation.assets).filter(notCssOrJS);
    const appcacheContents = appcacheTemplate({
      assets: [manifest, ...flatten(assets), ...map(prefixPath, externals)],
      fallback: mapValues(prefixPath, {
        '/gesetze': 'gesetze.html',
        '/gesetz': 'gesetz.html',
        '/suche': 'home.html', // TODO: Needs shell.
        '/index.html': 'index.html',
      }),
    });
    callback(null, appcacheContents);
  }

  let loc = stripPath(path.replace('.html', ''));
  loc = loc !== '/home' ? loc : '/';
  const memoryHistory = createMemoryHistory(loc);
  const store = createStore(memoryHistory, client, {});
  const history = syncHistoryWithStore(memoryHistory, store, {
    selectLocationState: state => state.get('routing'),
  });
  match({ history, routes, loc, basename: '/' }, (err, redirect, props) => {
    if (err) {
      throw new Error(err.message);
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
          meta={meta}
          title={manifestObj.short_name}
        >
          <AppServer renderProps={props} store={store} />
        </AppHtml>
      );

      callback(null, `<!doctype html>\n${page}\n`);
    });
  });
};
