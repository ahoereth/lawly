import { combineReducers } from 'redux-immutablejs';
import { routerReducer } from 'react-router-redux';

import core from '~/modules/core';
// eslint-disable-next-line camelcase
import law_index from '~/modules/law_index';
import laws from '~/modules/laws';
import search from '~/modules/search';
import user from '~/modules/user';

export default combineReducers({
  core,
  law_index,
  laws,
  search,
  user,
  routing: routerReducer,
});

export core from '~/modules/core';
// eslint-disable-next-line camelcase
export law_index from '~/modules/law_index';
export laws from '~/modules/laws';
export search from '~/modules/search';
export user from '~/modules/user';
