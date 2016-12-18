/* global document, window, module, process */
/* eslint-disable global-require, import/first */

import './polyfills';

import React from 'react';
import { render } from 'react-dom';
import { browserHistory as hist } from 'react-router';
import { syncHistoryWithStore } from 'react-router-redux';
import { AppContainer } from 'react-hot-loader';
import { isUndefined } from 'lodash';
import WebFontLoader from 'webfontloader';

import ApiClient from './helpers/ApiClient';
import createStore from './store/createStore';
import AppClient from './components/AppClient';
import { updateAvailable, renderShells } from './modules/core';

import 'react-mdl/extra/material';
import 'react-mdl/extra/css/material.red-amber.min.css';


WebFontLoader.load({
  google: {
    families: ['Roboto:400,400i,700,700i'],
  },
});


const client = new ApiClient(process.env.APIURL);
// eslint-disable-next-line no-underscore-dangle
const store = createStore(hist, client, window.__state);
const target = document.getElementById('app');
const history = syncHistoryWithStore(hist, store, {
  selectLocationState: state => state.get('routing'),
});

// Hacky scroll to top on route change. TODO.
history.listen(({ action, pathname }) => {
  if (action !== 'POP' && pathname.indexOf('/suche/') !== 0) {
    const elem = document.querySelector('.mdl-layout__content');
    elem.scrollTop = 0; // use 1px distance to avoid expanding the headbar.
  }
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


if (process.env.NODE_ENV === 'production') {
  const match = require('react-router').match;
  const routes = require('./routes').default;

  match({ history, routes, basename: '/' }, (error, redirect, props) => {
    render(
      <AppContainer>
        <AppClient store={store} renderProps={props} />
      </AppContainer>,
      target,
    );
  });
} else {
  render(
    <AppContainer>
      <AppClient store={store} renderProps={{ history }} />
    </AppContainer>,
    target,
  );

  if (module.hot) {
    module.hot.accept('./components/AppClient', () => {
      render(
        <AppContainer>
          <AppClient store={store} renderProps={{ history }} />
        </AppContainer>,
        target,
      );
    });
  }

  window.Perf = require('react-addons-perf');
}
