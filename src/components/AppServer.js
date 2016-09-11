import React, { PropTypes } from 'react';
import { RouterContext } from 'react-router';
import { Provider } from 'react-redux';


const AppServer = ({ renderProps, store }) => (
  <Provider store={store}>
    <RouterContext {...renderProps} />
  </Provider>
);

AppServer.propTypes = {
  renderProps: PropTypes.objectOf(PropTypes.object).isRequired,
  store: PropTypes.object.isRequired, // eslint-disable-line
};


export default AppServer;
