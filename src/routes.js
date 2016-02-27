import React from 'react';
import { Route, IndexRoute } from 'react-router';

import {
  Layout,
  Home,
  Gesetze,
  Gesetz,
} from './containers';


const routes = (
  <Route path='/' component={Layout}>
    <IndexRoute component={Home} title='Home' />
    <Route path='gesetze/:groupkey' component={Gesetz} title='Gesetz' />
    <Route path='gesetze' component={Gesetze} title='Index' />
  </Route>
);


export default routes;
