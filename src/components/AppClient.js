import React, { PropTypes } from 'react';
import { Provider } from 'react-redux';
import { Router } from 'react-router';
import ReactGA from 'react-ga';


let log = () => {};
if (process.env.NODE_ENV === 'production') {
  ReactGA.initialize(process.env.GA_ID);
  log = () => {
    /* global window */
    ReactGA.set({ page: window.location.pathname });
    ReactGA.pageview(window.location.pathname);
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
