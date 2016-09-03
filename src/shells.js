import fs from 'fs';
import path from 'path';
import React from 'react';
import { renderToString } from 'react-dom/server';
import { match, createMemoryHistory } from 'react-router';
import { syncHistoryWithStore } from 'react-router-redux';
import { endsWith, partialRight, trimEnd, trimStart } from 'lodash';
import { map, mapValues, flow, replace, flattenDeep } from 'lodash/fp';

import createStore from './store/createStore';
import ApiClient from './helpers/ApiClient';
import AppHtml from './components/AppHtml';
import AppServer from './components/AppServer';
import routes from './routes';
import settle from './helpers/settle';
import { fetchLawIndex } from './modules/law_index';
import { renderShells } from './modules/core';
import appcacheTemplate from './appcache.ejs';


const readFile = partialRight(fs.readFileSync, 'utf8');
const toArray = e => (Array.isArray(e) ? e : [e]);
const stripStatic = replace(/^\/static/, '');
const join = a => b => `${trimEnd(a, '/')}/${trimStart(b, '/')}`;
const parseAsset = map(flow(stripStatic, join(process.env.STATICS)));
const parseAssets = mapValues(flow(toArray, parseAsset));
const flatten = flow(map(map(i => i)), flattenDeep);


const ASSETS_PATH = path.resolve(process.env.DIST_PATH, 'assets.json');
const client = new ApiClient(process.env.APIURL);
const assets = flow(readFile, JSON.parse)(ASSETS_PATH);
assets.app = parseAssets(assets.app); // Need to avoid `web-worker` here
const { js, css } = assets.app;
const manifest = '/static/manifest.json';
const appcache = '/static/manifest.appcache';

// eslint-disable-next-line import/no-commonjs
module.exports = function render({ path }, callback) {
  if (path === '/') {
    const page = renderToString(
      <AppHtml
        appcache={appcache}
        js={js}
        css={css}
        assets={assets}
        manifest={manifest}
      />
    );
    callback(null, `<!doctype html>\n${page}\n`);
    return;
  }

  if (endsWith(path, 'manifest.appcache')) {
    const appcacheContents = appcacheTemplate({
      assets: [...flatten(assets), manifest],
      fallback: mapValues(join('/static'))({
        '/gesetze': '/gesetze.html',
        '/gesetz': '/gesetz.html',
        '/suche': '/home.html', // TODO: Needs shell.
        '/': '/home.html',
      }),
    });
    callback(null, appcacheContents);
  }

  let location = stripStatic(path.replace('.html', ''));
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
