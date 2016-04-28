import { createSelector } from 'reselect';
import { push } from 'react-router-redux';
import Immutable, { List, Map } from 'immutable';

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
  laws: List(),
  initials: List(),
  initial: 'a',
  page: 1,
  pageSize: 20,
  error: undefined,
  filters: Map(),
}), {
  [FETCH]: (state, { payload }) => state.merge({
    initials: List(payload.initials),
    laws: Immutable.fromJS(payload.index),
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

const getLawsByInitial = createSelector(
  [ getLawIndex, getInitial ],
  (laws, char) => laws.filter(law =>
    law.get('groupkey')[0].toLowerCase() == char
  )
);

export const getLawsByInitialCount = (state) => getLawsByInitial(state).size;

// Filter laws of the specified initial by starred if requested.
// Wrapped in its own selector to utilize memorization.
const getStarFilteredLawsByInitial = createSelector(
  [ getLawsByInitial, getFilters, getIndexStars ],
  (laws, filters, stars) => {
    if (filters.get('starred')) {
      laws = laws.filter(law => stars.contains(law.get('groupkey')));
    }

    return laws;
  }
);

// Filter laws of the specified initial probably already filtered by starred
// further more by groupkey if requested.
// Wrapped in its own selector to utilize memorization.
const getStarAndKeyFilteredLawsByInitial = createSelector(
  [ getStarFilteredLawsByInitial, getFilters ],
  (laws, filters) => {
    if (filters.get('groupkey')) {
      const needle = filters.get('groupkey', '').toLowerCase();
      laws = laws.filter(law =>
        law.get('groupkey').toLowerCase().indexOf(needle) > -1
      );
    }

    return laws;
  }
);

// Filter laws of the specified initial probably already filtered by starred
// and groupkey further more by title if requested.
// Wrapped in its own selector to utilize memorization.
const getFilteredLaws = createSelector(
  [ getStarAndKeyFilteredLawsByInitial, getFilters ],
  (laws, filters) => {
    if (filters.get('title')) {
      const needle = filters.get('title', '').toLowerCase();
      laws = laws.filter(law =>
        law.get('title').toLowerCase().indexOf(needle) > -1
      );
    }

    return laws;
  }
);

export const getFilteredLawsByPage = createSelector(
  [ getFilteredLaws, getPage, getPageSize ],
  (laws, page, size) => laws.slice(size * (page-1), size * page)
);
