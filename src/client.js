import React from 'react';
import { render } from 'react-dom';
import { browserHistory } from 'react-router';
import { syncHistoryWithStore } from 'react-router-redux';
import { AppContainer } from 'react-hot-loader';

import ApiClient from './helpers/ApiClient';
import createStore from './store/createStore';
import App from './App';

/* global navigator */
navigator.serviceWorker.register('/service-worker.js', { scope: '/' });

import 'react-mdl/extra/material';
import 'react-mdl/extra/css/material.red-amber.min.css';
import 'material-design-icons/iconfont/material-icons.css';

import './index.sss';


const APIURL = 'http://localhost:3000/v0';
const client = new ApiClient(APIURL);
const target = document.getElementById('app'); /* global document */
const store = createStore(client, window.__state); /* global window */
const history = syncHistoryWithStore(browserHistory, store, {
  selectLocationState: state => state.get('routing'),
});

// Hacky scroll to top on route change. TODO.
history.listen(location => {
  if (location.action === 'POP') { return; }
  let elem = document.querySelector('.mdl-layout__inner-container');
  if (elem) { elem.scrollTop = 0; }
});


render(
  <AppContainer>
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
