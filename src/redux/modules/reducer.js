import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';

import laws from './laws';
import search from './search';
import user from './user';

export default combineReducers({
  laws,
  search,
  user,
  routing: routerReducer
});
