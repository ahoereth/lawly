/* global document, window */
import './polyfills';

import React from 'react';
import { render } from 'react-dom';
import { match, browserHistory as hist } from 'react-router';
import { syncHistoryWithStore } from 'react-router-redux';
import { AppContainer } from 'react-hot-loader';
import { isUndefined } from 'lodash';

import routes from './routes';
import ApiClient from './helpers/ApiClient';
import createStore from './store/createStore';
import AppClient from './components/AppClient';
import { updateAvailable, renderShells } from './modules/core';

import 'react-mdl/extra/material';
import 'react-mdl/extra/css/material.red-amber.min.css';
import 'file?name=[name].[ext]!./manifest.json';


const client = new ApiClient(process.env.APIURL);
// eslint-disable-next-line no-underscore-dangle
const store = createStore(hist, client, window.__state);
const target = document.getElementById('app');
const history = syncHistoryWithStore(hist, store, {
  selectLocationState: state => state.get('routing'),
});

// Hacky scroll to top on route change. TODO.
history.listen(location => {
  if (location.action === 'POP') { return; }
  // Depending on layout settings: .mdl-layout__inner-container
  const elem = document.querySelector('.mdl-layout__content');
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

match({ history, routes }, (error, redirectLocation, renderProps) => {
  render(
    <AppContainer>
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
if (process.env.NODE_ENV === 'development') {
  // eslint-disable-next-line global-require
  window.Perf = require('react-addons-perf');
}
