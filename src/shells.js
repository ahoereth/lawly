import fs from 'fs';
import path from 'path';
import React from 'react';
import { renderToString } from 'react-dom/server';
import { match, createMemoryHistory } from 'react-router';
import { syncHistoryWithStore } from 'react-router-redux';
import { endsWith, trimEnd, partialRight } from 'lodash';
import { map, mapValues, flow, replace, flattenDeep } from 'lodash/fp';

import createStore from './store/createStore';
import ApiClient from './helpers/ApiClient';
import AppHtml from './components/AppHtml';
import AppServer from './components/AppServer';
import routes from './routes';
import settle from './helpers/settle';
import { fetchLawIndex } from './modules/law_index';
import { renderShells } from './modules/core';
import appcache from './appcache.ejs';


const APIURL = 'http://localhost:3000/v0';
const ASSETS_PATH = path.resolve(process.env.DIST_PATH, 'assets.json');
const PUBLIC_PATH = trimEnd(process.env.PUBLIC_PATH, '/') || '';


const readFile = partialRight(fs.readFileSync, 'utf8');
const toArray = e => (Array.isArray(e) ? e : [e]);
const stripStatic = map(replace(/^\/static/, ''));
const prefix = prefix => str => `${prefix}${str}`;
const parseAsset = mapValues(flow(toArray, stripStatic, prefix(PUBLIC_PATH)));
const flatten = flow(map(map(i => i)), flattenDeep);


const client = new ApiClient(APIURL);
const assets = flow(readFile, JSON.parse, mapValues(parseAsset))(ASSETS_PATH);
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

  if (endsWith(path, 'manifest.appcache')) {
    const manifest = appcache({
      assets: [...flatten(assets), '/manifest.json'],
      fallback: mapValues(prefix(PUBLIC_PATH))({
        '/': '/home.html',
        '/suche': '/index.html', // TODO: Needs shell.
        '/gesetz': '/gesetz.html',
        '/gesetze': '/gesetze.html',
      }),
    });
    callback(null, manifest);
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
        <AppHtml assets={assets} js={js} css={css} state={store.getState()}>
          <AppServer renderProps={props} store={store} />
        </AppHtml>
      );

      callback(null, `<!doctype html>\n${page}\n`);
    });
  });
};
