import React from 'react';
import { Route, IndexRoute } from 'react-router';

import {
  Layout,
  Home
} from './containers';


const routes = (
  <Route path='/' component={Layout} name='Lawly'>
    <IndexRoute component={Home} />
  </Route>
);


export default routes;
