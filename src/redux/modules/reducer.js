import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';

import gesetze from './gesetze';

export default combineReducers({
  gesetze,
  routing: routerReducer
});
