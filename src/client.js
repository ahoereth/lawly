/* global document, window, navigator */
import './polyfills';

import React from 'react';
import { render } from 'react-dom';
import { match, browserHistory as hist } from 'react-router';
import { syncHistoryWithStore } from 'react-router-redux';
import { AppContainer } from 'react-hot-loader';
import Redbox from 'redbox-react';
import { isUndefined } from 'lodash';

import routes from './routes';
import ApiClient from './helpers/ApiClient';
import createStore from './store/createStore';
import AppClient from './components/AppClient';
import { updateAvailable, renderShells } from './modules/core';

import 'react-mdl/extra/material';
import 'react-mdl/extra/css/material.red-amber.min.css';
import 'file?name=[name].[ext]!./manifest.json';


const APIURL = 'http://localhost:3000/v0';
const client = new ApiClient(APIURL);

// eslint-disable-next-line no-underscore-dangle
const store = createStore(hist, client, window.__state);
const target = document.getElementById('app');
const history = syncHistoryWithStore(hist, store, {
  selectLocationState: state => state.get('routing'),
});

// Hacky scroll to top on route change. TODO.
history.listen(location => {
  if (location.action === 'POP') { return; }
  const elem = document.querySelector('.mdl-layout__inner-container');
  if (elem) { elem.scrollTop = 0; }
});


// Turn shell-only rendering off ASAP on the client side.
store.dispatch(renderShells(false));

// Application Cache event handling.
if (!isUndefined(window.applicationCache)) {
  const appcache = window.applicationCache;
  appcache.addEventListener('updateready', () => {
    store.dispatch(updateAvailable());
  }, false);
}

// Service Worker registration. TODO: Path outdated.
if (!isUndefined(navigator) && !isUndefined(navigator.serviceWorker)) {
  navigator.serviceWorker.register('/service-worker.js', { scope: '/' });
}

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

/* global process, require */
if (process.env.NODE_ENV !== 'production') {
  // eslint-disable-next-line global-require
  window.Perf = require('react-addons-perf');
}
