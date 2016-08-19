import fs from 'fs';
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
const client = new ApiClient(APIURL);
const assets = JSON.parse(fs.readFileSync(process.env.ASSETS_PATH, 'utf8'));
const { js, css } = mapValues(find(assets, (val, key) => endsWith(key, 'app')),
  val => (Array.isArray(val) ? val : [val])
);

// eslint-disable-next-line import/no-commonjs
module.exports = function render({ path }, callback) {
  const memoryHistory = createMemoryHistory(path);
  const store = createStore(memoryHistory, client, {});
  const history = syncHistoryWithStore(memoryHistory, store, {
    selectLocationState: state => state.get('routing'),
  });

  match({ history, routes, location: path }, (error, redirect, renderProps) => {
    if (error) {
      throw new Error(error.message);
    }

    if (redirect) {
      const { pathname, search } = redirect;
      throw new Error(`redirect to ${pathname}${search}!`);
    }

    if (!renderProps) {
      throw new Error('404: Not found.');
    }

    const deps = [
      store.dispatch(fetchLawIndex()),
    ];

    Promise.all(deps.map(settle)).then(() => {
      const page = renderToString(
        <AppHtml js={js} css={css} state={store.getState()}>
          <AppServer renderProps={renderProps} store={store} />
        </AppHtml>
      );

      callback(null, `<!doctype html>\n${page}\n`);
    });
  });
};
