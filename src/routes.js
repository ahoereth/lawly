import React from 'react';
import { Route, IndexRoute } from 'react-router'; // Redirect

import {
  Layout,
  Home,
  Search,
  LawIndex,
  Law,
} from './containers';


const routes = (
  <Route path='/' component={Layout}>
    <IndexRoute component={Home} title='Home' />
    <Route path='suche(/:query)(/:page)' component={Search} title='Suche' />
    <Route path='gesetz(/:groupkey)' component={Law} title='Gesetz' />
    <Route path='gesetze(/:a)(/:b)(/:c)' component={LawIndex} title='Index' />

    {/* <Redirect from='gesetz' to='gesetze' /> */}
  </Route>
);


export default routes;
