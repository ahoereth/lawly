import { combineReducers } from 'redux-immutablejs';
import { routerReducer } from 'react-router-redux';

/* eslint-disable import/no-named-as-default */
import core from '~/modules/core';
import law_index from '~/modules/law_index'; // eslint-disable-line camelcase
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
export law_index from '~/modules/law_index'; // eslint-disable-line camelcase
export laws from '~/modules/laws';
export search from '~/modules/search';
export user from '~/modules/user';
