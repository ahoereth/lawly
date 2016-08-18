import { combineReducers } from 'redux-immutablejs';
import { routerReducer } from 'react-router-redux';

// eslint-disable-next-line camelcase
import law_index from '~/modules/law_index';
import laws from '~/modules/laws';
import search from '~/modules/search';
import user from '~/modules/user';

export default combineReducers({
  law_index,
  laws,
  search,
  user,
  routing: routerReducer,
});
