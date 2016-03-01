import React from 'react';
import { Route, IndexRoute, Redirect } from 'react-router';

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
    <Route path='search(/:query)(/:page)' component={Search} title='Suche' />
    <Route path='gesetz/:groupkey' component={Law} title='Gesetz' />
    <Route path='gesetze(/:initial)(/:page)' component={LawIndex} title='Index' />

    <Redirect from='gesetz' to='gesetze' />
  </Route>
);


export default routes;
