import React from 'react';
import { Route, IndexRoute } from 'react-router'; // Redirect

import {
  Layout,
  Home,
  Search,
  LawIndex,
  Law,
  LegalNotice,
} from './containers';

const routes = (
  <Route path="/" component={Layout}>
    <IndexRoute component={Home} />
    <Route path="suche(/:query)(/:page)" component={Search} />
    <Route path="gesetz(/:groupkey)(/:enumeration)" component={Law} />
    <Route path="gesetze(/:a)(/:b)(/:c)" component={LawIndex} />
    <Route path="impressum" component={LegalNotice} />

    {/* <Redirect from='gesetz' to='gesetze' /> */}
  </Route>
);

export default routes;
