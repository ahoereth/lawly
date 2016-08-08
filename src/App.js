import React, { PropTypes } from 'react';
import { Provider } from 'react-redux';
import { Router, Route, IndexRoute, Redirect } from 'react-router';

import {
  Layout,
  Home,
  Search,
  LawIndex as Index,
  Law,
} from 'containers';


const App = ({ history, store }) => (
  <Provider store={store}>
    <Router history={history}>
      <Route path='/' component={Layout}>
        <IndexRoute component={Home} title='Home' />
        <Route path='suche(/:query)(/:page)' component={Search} title='Suche' />
        <Route path='gesetz/:groupkey' component={Law} title='Gesetz' />
        <Route path='gesetze(/:a)(/:b)(/:c)' component={Index} title='Index' />

        <Redirect from='gesetz' to='gesetze' />
      </Route>
    </Router>
  </Provider>
);

App.propTypes = {
  history: PropTypes.any.isRequired,
  store: PropTypes.any.isRequired,
};


export default App;
