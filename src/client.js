import React from 'react';
import { render } from 'react-dom';
import { Router, match, browserHistory as history } from 'react-router';
import { Provider } from 'react-redux';

import createStore from './redux/createStore';
import routes from './routes';


const target = document.getElementById('app'); /* global document */
const store = createStore(history, window.__state); /* global window */
const location = window.location; /* global window */


// Was the app already rendered on the server side?
if (!target.childElementCount) {
  // Match server and client side routers.
  match({ routes, location }, (error, redirect, props) => {
    render(
      <Provider store={store}>
        <Router {...props} history={history} />
      </Provider>, target);
  });
}
