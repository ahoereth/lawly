import React, { PropTypes } from 'react';
import { Provider } from 'react-redux';
import { Router } from 'react-router';
import ReactGA from 'react-ga';

import routes from '../routes';


let log = () => {};
if (process.env.NODE_ENV === 'production') {
  ReactGA.initialize(process.env.GA_ID);
  let lastPathname;
  log = () => {
    const { pathname } = window.location;
    if (pathname !== lastPathname) {
      /* global window */
      ReactGA.set({ page: window.location.pathname });
      ReactGA.pageview(window.location.pathname);
    }
    lastPathname = pathname;
  };
}


const AppClient = ({ renderProps, store }) => (
  <Provider store={store}>
    <Router {...{ routes, ...renderProps }} onUpdate={log} />
  </Provider>
);


AppClient.propTypes = {
  renderProps: PropTypes.objectOf(PropTypes.object).isRequired,
  store: PropTypes.object.isRequired, // eslint-disable-line
};


export default AppClient;
