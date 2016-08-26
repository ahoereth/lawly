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
    <IndexRoute component={Home} />
    <Route path='suche(/:query)(/:page)' component={Search} />
    <Route path='gesetz(/:groupkey)' component={Law} />
    <Route path='gesetze(/:a)(/:b)(/:c)' component={LawIndex} />

    {/* <Redirect from='gesetz' to='gesetze' /> */}
  </Route>
);


export default routes;
