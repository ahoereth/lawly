import { combineReducers } from 'redux-immutablejs';
import { routerReducer } from 'react-router-redux';

// eslint-disable-next-line camelcase
import law_index from '~/modules/law_index';
import laws from '~/modules/laws';
import search from '~/modules/search';
import shells from '~/modules/shells';
import user from '~/modules/user';

export default combineReducers({
  law_index,
  laws,
  search,
  user,
  shells,
  routing: routerReducer,
});

// eslint-disable-next-line camelcase
export law_index from '~/modules/law_index';
export laws from '~/modules/laws';
export search from '~/modules/search';
export shells from '~/modules/shells';
export user from '~/modules/user';
