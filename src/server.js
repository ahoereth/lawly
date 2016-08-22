import http from 'http';
import fs from 'fs';
import path from 'path';
import React from 'react';
import { renderToString } from 'react-dom/server';
import { match, createMemoryHistory } from 'react-router';
import { syncHistoryWithStore } from 'react-router-redux';
import { find, endsWith, mapValues } from 'lodash';

import createStore from './store/createStore';
import ApiClient from './helpers/ApiClient';
import AppHtml from './components/AppHtml';
import AppServer from './components/AppServer';
import routes from './routes';
import settle from './helpers/settle';
import { fetchLawIndex } from './modules/law_index';


const APIURL = 'http://localhost:3000/v0';
const ASSETS_PATH = path.resolve(__dirname, 'assets.json');

const client = new ApiClient(APIURL);
const assets = JSON.parse(fs.readFileSync(ASSETS_PATH, 'utf8'));
const { js, css } = mapValues(find(assets, (val, key) => endsWith(key, 'app')),
  val => (Array.isArray(val) ? val : [val])
);

http.createServer((req, res) => {
  const { url } = req;

  // Static routes.
  if (url.indexOf('/static') === 0) {
    fs.readFile(path.resolve(__dirname, url.slice(1)), (err, data) => {
      if (err) {
        res.writeHead(404);
        res.end(JSON.stringify(err));
      } else {
        res.writeHead(200);
        res.end(data);
      }
    });
    return;
  }

  // Dynamic routes.
  const memoryHistory = createMemoryHistory(url);
  const store = createStore(memoryHistory, client, {});
  const history = syncHistoryWithStore(memoryHistory, store, {
    selectLocationState: state => state.get('routing'),
  });
  match({ history, routes, location: url }, (error, redirect, renderProps) => {
    if (error) {
      res.writeHead(500, { 'Content-Type': 'text/plain; charset=UTF-8' });
      res.end(error.message);
      return;
    }

    if (redirect) {
      const { pathname, search } = redirect;
      res.writeHead(302, { Location: pathname + search });
      res.end();
      return;
    }

    if (renderProps) {
      const asyncDeps = [
        store.dispatch(fetchLawIndex({ limit: true, cachable: false })),
      ];

      Promise.all(asyncDeps.map(settle)).then(() => {
        const page = renderToString(
          <AppHtml js={js} css={css} state={store.getState()}>
            <AppServer renderProps={renderProps} store={store} />
          </AppHtml>
        );

        res.writeHead(200, { 'Content-Type': 'text/html; charset=UTF-8' });
        res.end(`<!doctype html>\n${page}\n`);
      });
      return;
    }

    res.writeHead(404, { 'Content-Type': 'text/plain; charset=UTF-8' });
    res.end('Not found');
  });
}).listen(8080, (err) => {
  if (err) {
    throw err;
  }

  // eslint-disable-next-line no-console
  console.log('Listening on 8080...');
});
