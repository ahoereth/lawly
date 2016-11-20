import fs from 'fs';
import React from 'react';
import { renderToString } from 'react-dom/server';
import { match, createMemoryHistory } from 'react-router';
import { syncHistoryWithStore } from 'react-router-redux';
import { partialRight, trimEnd, trimStart } from 'lodash';
import { mapValues, flow } from 'lodash/fp';
import manup from 'manup';

import routes from '~/routes';
import createStore from '~/store/createStore';
import AppHtml from '~/components/AppHtml';
import AppServer from '~/components/AppServer';
import { fetchLawIndex } from '~/modules/law_index';
import { renderShells } from '~/modules/core';
import ApiClient from './ApiClient';
import settle from './settle';


const publicPath = process.env.PUBLIC_PATH;
const readJSON = flow(partialRight(fs.readFileSync, 'utf8'), JSON.parse);
const toArray = e => (Array.isArray(e) ? e : [e]);
const toArrays = mapValues(toArray);
const join = a => b => `${trimEnd(a, '/')}/${trimStart(b, '/')}`;

export const stripPath = str => str.slice(publicPath.length - 1);
export const prefixPath = join(publicPath);

const ASSETS_PATH = join(process.env.DIST_PATH)('assets.json');
const DIST_MANIFEST_PATH = join(process.env.DIST_PATH)('static/manifest.json');
const client = new ApiClient(process.env.APIURL);
export const assets = readJSON(ASSETS_PATH);
const { js, css } = toArrays(assets.app);

// Only read from file system once.
let manifest = false;


export default function (location, { manifest: devMan, asyncDeps = [] } = {}) {
  manifest = devMan || (manifest || readJSON(DIST_MANIFEST_PATH));
  return new Promise((resolve) => {
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
        throw new Error(`404: Not found: ${location}`);
      }

      store.dispatch(renderShells(true));
      asyncDeps = asyncDeps.concat([ // eslint-disable-line no-param-reassign
        store.dispatch(fetchLawIndex({ limit: true, cachable: false })),
      ]);

      Promise.all(asyncDeps.map(settle)).then(() => {
        const page = renderToString((
          <AppHtml
            appcache={prefixPath('manifest.appcache')}
            assets={assets}
            js={js}
            css={css}
            state={store.getState()}
            manifest={prefixPath('manifest.json')}
            meta={manup(manifest)}
            title={manifest.short_name}
          >
            <AppServer renderProps={props} store={store} />
          </AppHtml>
        ));
        resolve(`<!doctype html>\n${page}\n`);
      });
    });
  });
}
