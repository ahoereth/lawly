import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';

import gesetze from './gesetze';
import search from './search';

export default combineReducers({
  gesetze,
  search,
  routing: routerReducer
});
