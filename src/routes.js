import React from 'react';
import { Route, IndexRoute } from 'react-router';

import {
  Layout,
  Home,
  Search,
  LawIndex,
  Law,
} from 'containers';


const routes = (
  <Route path='/' component={Layout}>
    <IndexRoute component={Home} title='Home' />
    <Route path='search(/:query)' component={Search} title='Suche' />
    <Route path='gesetze/:groupkey' component={Law} title='Gesetz' />
    <Route path='gesetze' component={LawIndex} title='Index' />
  </Route>
);


export default routes;
