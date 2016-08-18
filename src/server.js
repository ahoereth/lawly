import http from 'http';
import fs from 'fs';
import path from 'path';
import React from 'react';
import { renderToString } from 'react-dom/server';
import { match } from 'react-router';
import { createMemoryHistory } from 'history';

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


http.createServer((req, res) => {
  const history = createMemoryHistory();
  const location = history.createLocation(req.url);

  match({ routes, location }, (error, redirectLocation, renderProps) => {
    if (error) {
      res.writeHead(500, { 'Content-Type': 'text/plain; charset=UTF-8' });
      res.end(error.message);
    } else if (redirectLocation) {
      const { pathname, search } = redirectLocation;
      res.writeHead(302, { Location: pathname + search });
      res.end();
    } else if (renderProps) {
      let { js, css } = assets.server;
      js = Array.isArray(js) ? js : [js];
      css = Array.isArray(css) ? css : [css];

      const page = renderToString(
        <AppHtml js={js} css={css}>
          <AppServer renderProps={renderProps} store={store} />
        </AppHtml>
      );

      res.writeHead(200, { 'Content-Type': 'text/html; charset=UTF-8' });
      res.end(page);
    } else {
      res.writeHead(404, { 'Content-Type': 'text/plain; charset=UTF-8' });
      res.end('Not found');
    }
  });
}).listen(8080, (err) => {
  if (err) {
    throw err;
  }

  // eslint-disable-next-line no-console
  console.log('Listening on 8080...');
});
