import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';

import laws from './laws';
import search from './search';

export default combineReducers({
  laws,
  search,
  routing: routerReducer
});
