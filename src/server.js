import http from 'http';
import fs from 'fs';
import path from 'path';
import React from 'react';
import { renderToString } from 'react-dom/server';
import { match } from 'react-router';
import { createMemoryHistory } from 'history';
import { find, endsWith, mapValues } from 'lodash';

import createStore from './store/createStore';
import ApiClient from './helpers/ApiClient';
import AppHtml from './components/AppHtml';
import AppServer from './components/AppServer';
import routes from './routes';


const APIURL = 'http://localhost:3000/v0';
const client = new ApiClient(APIURL);
const store = createStore(client, {});
const assetsPath = path.resolve(__dirname, 'assets.json');
const assets = JSON.parse(fs.readFileSync(assetsPath, 'utf8'));
const { js, css } = mapValues(find(assets, (val, key) => endsWith(key, 'app')),
  val => (Array.isArray(val) ? val : [val])
);


http.createServer((req, res) => {
  const { url } = req;

  // Static routes.
  if (url.indexOf('/static') === 0) {
    fs.readFile(path.join(__dirname, url), (err, data) => {
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
  const history = createMemoryHistory();
  const location = history.createLocation(url);
  match({ routes, location }, (error, redirectLocation, renderProps) => {
    if (error) {
      res.writeHead(500, { 'Content-Type': 'text/plain; charset=UTF-8' });
      res.end(error.message);
      return;
    }

    if (redirectLocation) {
      const { pathname, search } = redirectLocation;
      res.writeHead(302, { Location: pathname + search });
      res.end();
      return;
    }

    if (renderProps) {
      const page = renderToString(
        <AppHtml js={js} css={css}>
          <AppServer renderProps={renderProps} store={store} />
        </AppHtml>
      );

      res.writeHead(200, { 'Content-Type': 'text/html; charset=UTF-8' });
      res.end(page);
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
