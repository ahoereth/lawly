import React from 'react';
import { render } from 'react-dom';
import { Router, match, browserHistory as history } from 'react-router';

import routes from './routes';

/* global document, window */
const target = document.getElementById('app');
const location = window.location;

// Was the app already rendered on the server side?
if (!target.childElementCount) {
  // Match server and client side routers.
  match({ routes, location }, (error, redirect, props) => {
    render(<Router {...props} history={history} />, target);
  });
}
