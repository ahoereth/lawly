import React from 'react';
import { render } from 'react-dom';
import { Router, browserHistory as history } from 'react-router';
import { Provider } from 'react-redux';

import createStore from './redux/createStore';
import routes from './routes';

import 'file?name=material.[ext]!react-mdl/extra/material';
import 'react-mdl/extra/material.min.css';
import 'material-design-icons/iconfont/material-icons.css';


const target = document.getElementById('app'); /* global document */
const store = createStore(history, window.__state); /* global window */

render(
  <Provider store={store}>
    <Router history={history}>
      {routes}
    </Router>
  </Provider>,
  target
);
