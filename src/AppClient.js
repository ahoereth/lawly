import React, { PropTypes } from 'react';
import { Provider } from 'react-redux';
import { Router } from 'react-router';

import routes from './routes';


const App = ({ history, store }) => (
  <Provider store={store}>
    <Router history={history}>
      {routes}
    </Router>
  </Provider>
);

App.propTypes = {
  history: PropTypes.any.isRequired,
  store: PropTypes.any.isRequired,
};


export default App;
