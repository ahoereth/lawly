import React, { PropTypes } from 'react';
import { RouterContext } from 'react-router';
import { Provider } from 'react-redux';


const AppServer = ({ renderProps, store }) => (
  <Provider store={store}>
    <RouterContext {...renderProps} />
  </Provider>
);

AppServer.propTypes = {
  renderProps: PropTypes.any.isRequired,
  store: PropTypes.any.isRequired,
};


export default AppServer;
