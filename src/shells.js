import fs from 'fs';
import path from 'path';
import React from 'react';
import { renderToString } from 'react-dom/server';
import { match, createMemoryHistory } from 'react-router';
import { syncHistoryWithStore } from 'react-router-redux';

import createStore from './store/createStore';
import ApiClient from './helpers/ApiClient';
import AppHtml from './components/AppHtml';
import AppServer from './components/AppServer';
import routes from './routes';
import settle from './helpers/settle';
import { fetchLawIndex } from './modules/law_index';
import { renderShells } from './modules/shells';
import appcache from './appcache.ejs';

const APIURL = 'http://localhost:3000/v0';
const client = new ApiClient(APIURL);
const ASSETS_PATH = path.resolve(process.env.DIST_PATH, 'assets.json');
const assets = JSON.parse(fs.readFileSync(ASSETS_PATH, 'utf8'));
const { js, css } = assets.app;

// eslint-disable-next-line import/no-commonjs
module.exports = function render({ path }, callback) {
  if (path === '/') {
    const page = renderToString(
      <AppHtml js={js} css={css} assets={assets} />
    );
    callback(null, `<!doctype html>\n${page}\n`);
    return;
  }

  if (path === '/manifest.appcache') {
    const manifest = appcache({
      assets: [css, js, assets['web-worker'].js],
      fallback: {
        '/': '/home.html',
        '/suche': '/index.html',
        '/gesetz': '/gesetz.html',
        '/gesetze': '/gesetze.html',
      },
    });
    callback(null, manifest);
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
        <AppHtml js={js} css={css} state={store.getState()} assets={assets}>
          <AppServer renderProps={props} store={store} />
        </AppHtml>
      );

      callback(null, `<!doctype html>\n${page}\n`);
    });
  });
};
