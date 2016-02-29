import React from 'react';
import { render } from 'react-dom';
import { Router, browserHistory } from 'react-router';
import { Provider } from 'react-redux';
import { syncHistoryWithStore } from 'react-router-redux';

import ApiClient from './helpers/ApiClient';
import createStore from './redux/createStore';
import routes from './routes';

import 'file?name=material.[ext]!react-mdl/extra/material';
import 'react-mdl/extra/material.min.css';
import 'material-design-icons/iconfont/material-icons.css';


const APIURL = 'http://localhost:3000';
const client = new ApiClient(APIURL);
const target = document.getElementById('app'); /* global document */
const store = createStore(client, window.__state); /* global window */
const history = syncHistoryWithStore(browserHistory, store);


render(
  <Provider store={store}>
    <Router history={history}>
      {routes}
    </Router>
  </Provider>,
  target
);