import { combineReducers } from 'redux-immutablejs';
import { routerReducer } from 'react-router-redux';

import law_index from './law_index';
import laws from './laws';
import search from './search';
import user from './user';

export default combineReducers({
  law_index,
  laws,
  search,
  user,
  routing: routerReducer
});
