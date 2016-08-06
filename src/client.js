import React from 'react';
import { render } from 'react-dom';
import { Router, browserHistory } from 'react-router';
import { Provider } from 'react-redux';
import { syncHistoryWithStore } from 'react-router-redux';

import ApiClient from './helpers/ApiClient';
import createStore from './store/createStore';
import routes from './routes';

/* global require, DEBUG */
if (!DEBUG) {
  require('offline-plugin/runtime').install();
}

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
  <Provider store={store}>
    <Router history={history}>
      {routes}
    </Router>
  </Provider>,
  target
);
