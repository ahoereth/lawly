import { createSelector } from 'reselect';
import { push } from 'react-router-redux';
import { List, OrderedMap, Map } from 'immutable';

import { pick } from 'helpers/utils';
import createReducer from '../createReducer';
import { getIndexStars } from './user';


// ******************************************************************
// ACTIONS
export const FETCH = 'law_index/FETCH';
export const SELECT_INITIAL = 'law_index/SELECT_INITIAL';
export const SELECT_PAGE = 'law_index/SELECT_PAGE';
export const FILTER = 'law_index/FILTER';



// ******************************************************************
// REDUCERS
export default createReducer(Map({
  laws: OrderedMap(),
  initials: List(),
  initial: 'a',
  page: 1,
  pageSize: 20,
  error: undefined,
  filters: Map(),
}), {
  [FETCH]: (state, { payload }) => state.merge({
    initials: List(payload.initials),
    laws: OrderedMap(payload.index),
  }),
  [SELECT_PAGE]: (state, { payload }) => state.set('page', payload),
  [SELECT_INITIAL]: (state, { payload }) => state.set('initial', payload),
  [FILTER]: (state, { payload }) => state.set('filters', Map(payload)),
});



// ******************************************************************
// ACTION CREATORS
export const fetchLawIndex = () => ({
  type: FETCH,
  promise: api => api.get({ name: 'laws' })
});

export const selectLawIndexPage = (page = 1) => (dispatch, getState) => {
  const initial = getInitial(getState());
  const pagePath = page > 1 ? '/' + page : '';
  dispatch({ type: SELECT_PAGE, payload: page });
  dispatch(push(`/gesetze/${initial}${pagePath}`));
};

export const selectLawIndexInitial = (initial = 'a') => (dispatch) => {
  dispatch({ type: SELECT_INITIAL, payload: initial.toLowerCase() });
  dispatch(selectLawIndexPage(1));
};

export const filterLawIndex = (filters = {}) => (dispatch) => {
  filters = pick(filters, 'starred', 'title', 'groupkey');
  dispatch({ type: FILTER, payload: filters });
  dispatch(selectLawIndexPage(1));
};



// ******************************************************************
// SELECTORS
export const getLawIndex = (state) => state.getIn(['law_index', 'laws']);

export const getPageSize = (state) => state.getIn(['law_index', 'pageSize']);

export const getPage = (state) => state.getIn(['law_index', 'page']);

export const getInitials = (state) => state.getIn(['law_index', 'initials']);

export const getInitial = (state) => state.getIn(['law_index', 'initial']);

export const getFilters = (state) => state.getIn(['law_index', 'filters']);

export const getLawsByInitial = createSelector(
  [ getLawIndex, getInitial ],
  (laws, char) => laws.filter((law, key) => (key[0].toLowerCase() == char))
);

export const getLawsByInitialAndFilter = createSelector(
  [ getLawsByInitial, getFilters, getIndexStars ],
  (laws, filters, stars) => {
    if (filters.get('starred')) {
      laws = OrderedMap(stars.toArray().map(key => [key, laws.get(key)]));
    }

    laws = laws.toSeq();

    if (filters.get('title')) {
      const needle = filters.get('title').toLowerCase();
      laws = laws.filter(hay => hay.toLowerCase().indexOf(needle) > -1);
    }

    if (filters.get('groupkey')) {
      const needle = filters.get('groupkey').toLowerCase();
      laws = laws.filter((_, hay) => hay.toLowerCase().indexOf(needle) > -1);
    }

    return laws.toOrderedMap();
  }
);

export const getLawsByInitialFilterAndPage = createSelector(
  [ getLawsByInitialAndFilter, getPage, getPageSize ],
  (laws, page, size) => ({
    total: laws.size,
    laws: laws.slice(size * (page-1), size * page)
  })
);
