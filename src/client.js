import React from 'react';
import { render } from 'react-dom';
import { browserHistory } from 'react-router';
import { syncHistoryWithStore } from 'react-router-redux';
import { AppContainer } from 'react-hot-loader';
import Redbox from 'redbox-react';

import ApiClient from './helpers/ApiClient';
import createStore from './store/createStore';
import App from './App';

import 'react-mdl/extra/material';
import 'react-mdl/extra/css/material.red-amber.min.css';
import 'file?name=[name].[ext]!manifest.json';
import './index.sss';

const sw = navigator.serviceWorker; /* global navigator */
if (sw) {
  sw.register('/service-worker.js', { scope: '/' });
}

/* global window, document */
/* eslint-disable no-underscore-dangle */
const APIURL = 'http://localhost:3000/v0';
const client = new ApiClient(APIURL);
const target = document.getElementById('app');
const store = createStore(client, window.__state);
const history = syncHistoryWithStore(browserHistory, store, {
  selectLocationState: state => state.get('routing'),
});

// Hacky scroll to top on route change. TODO.
history.listen(location => {
  if (location.action === 'POP') { return; }
  const elem = document.querySelector('.mdl-layout__inner-container');
  if (elem) { elem.scrollTop = 0; }
});


render(
  <AppContainer errorReporter={Redbox}>
    <App store={store} history={history} />
  </AppContainer>,
  target
);

/* global module */
if (module.hot) {
  module.hot.accept('./App', () => {
    render(
      <AppContainer>
        <App store={store} history={history} />
      </AppContainer>,
      target
    );
  });
}

/* eslint-disable global-require */
/* global process, window, require */
if (process.env.NODE_ENV !== 'production') {
  window.Perf = require('react-addons-perf');
}
