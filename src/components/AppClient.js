import React, { PropTypes } from 'react';
import { Provider } from 'react-redux';
import { Router } from 'react-router';



const App = ({ renderProps, store }) => (
  <Provider store={store}>
    <Router {...renderProps} />
  </Provider>
);

App.propTypes = {
  renderProps: PropTypes.any.isRequired,
  store: PropTypes.any.isRequired,
};


export default App;
