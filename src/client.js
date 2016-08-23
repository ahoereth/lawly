import './polyfills';

import React from 'react';
import { render } from 'react-dom';
import { match, browserHistory as hist } from 'react-router';
import { syncHistoryWithStore } from 'react-router-redux';
import { AppContainer } from 'react-hot-loader';
import Redbox from 'redbox-react';
import { isUndefined as isUndef } from 'lodash';

import routes from './routes';
import ApiClient from './helpers/ApiClient';
import createStore from './store/createStore';
import AppClient from './components/AppClient';

import 'react-mdl/extra/material';
import 'react-mdl/extra/css/material.red-amber.min.css';
import 'file?name=../[name].[ext]!./manifest.json';

/*
import 'file?name=[name].[ext]!./service-worker.js'
if (!isUndef(global.navigator) && !isUndef(global.navigator.serviceWorker)) {
  global.navigator.serviceWorker.register('/service-worker.js', { scope: '/' });
}
*/

const APIURL = 'http://localhost:3000/v0';
const client = new ApiClient(APIURL);

// eslint-disable-next-line no-underscore-dangle
const store = createStore(hist, client, window.__state); /* global window */
const target = document.getElementById('app'); /* global document */
const history = syncHistoryWithStore(hist, store, {
  selectLocationState: state => state.get('routing'),
});

// Hacky scroll to top on route change. TODO.
history.listen(location => {
  if (location.action === 'POP') { return; }
  const elem = document.querySelector('.mdl-layout__inner-container');
  if (elem) { elem.scrollTop = 0; }
});

match({ history, routes }, (error, redirectLocation, renderProps) => {
  render(
    <AppContainer errorReporter={Redbox}>
      <AppClient store={store} renderProps={renderProps} />
    </AppContainer>,
    target
  );
});

/* global module */
if (module.hot) {
  module.hot.accept('./components/AppClient', () => {
    render(
      <AppContainer>
        <AppClient store={store} history={history} />
      </AppContainer>,
      target
    );
  });
}

/* global process, window, require */
if (process.env.NODE_ENV !== 'production' && !isUndef(window)) {
  // eslint-disable-next-line global-require
  window.Perf = require('react-addons-perf');
}
