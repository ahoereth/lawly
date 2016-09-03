import React, { PropTypes } from 'react';
import { Provider } from 'react-redux';
import { Router } from 'react-router';
import ReactGA from 'react-ga';


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


const App = ({ renderProps, store }) => (
  <Provider store={store}>
    <Router {...renderProps} onUpdate={log} />
  </Provider>
);

App.propTypes = {
  renderProps: PropTypes.any.isRequired,
  store: PropTypes.any.isRequired,
};


export default App;
