import { createSelector } from 'reselect';
import { push } from 'react-router-redux';
import { batchActions } from 'redux-batched-actions';
import { List, Map, fromJS } from 'immutable';

import createReducer from '~/store/createReducer';

export const SCOPE = 'search';

// ******************************************************************
// ACTIONS
export const SEARCH = 'search/SEARCH';
export const SEARCHED = 'search/SEARCHED';
export const LOCAL_ONLY = 'search/filter/LOCAL_ONLY';
export const SELECT_PAGE = 'search/SELECT_PAGE';
export const LOADING = 'search/LOADING';

// ******************************************************************
// REDUCERS
export default createReducer(
  Map({
    loading: false,
    page: 1,
    pageSize: 20,
    query: '',
    results: List(),
    total: 0,
  }),
  {
    [LOADING]: (state, { payload }) => state.set('loading', payload),
    [SEARCH]: (state, { payload = '' }) => state.set('query', payload),
    [SEARCHED]: (state, { payload: { results, total } }) =>
      state.merge(
        Map({
          loading: false,
          results: fromJS(results || []),
          total: total || 0,
        }),
      ),
    [SELECT_PAGE]: (state, { payload = 1 }) => state.set('page', payload),
  },
);

// ******************************************************************
// ACTION CREATORS
export const selectPage = (page = 1) => (dispatch, getState) => {
  const query = getState().getIn([SCOPE, 'query'], '');
  const pagePath = page > 1 ? `/${page}` : '';
  dispatch({ type: SELECT_PAGE, payload: page || 1 });
  dispatch(push(`/suche/${query}${pagePath}`));
};

export const search = (query = '') => dispatch => {
  dispatch(
    batchActions([
      { type: SEARCH, payload: query },
      { type: SEARCHED, payload: {} },
      { type: LOADING, payload: true },
    ]),
  );
  dispatch(selectPage(1));
  return dispatch({
    type: SEARCHED,
    meta: { debounce: { time: 100 } },
    promise: api => api.search(query),
  });
};

// ******************************************************************
// SELECTORS
export const getQuery = state => state.getIn([SCOPE, 'query'], '');

export const getPage = state => state.getIn([SCOPE, 'page'], 1);

export const getPageSize = state => state.getIn([SCOPE, 'pageSize'], 20);

export const getResults = state => state.getIn([SCOPE, 'results'], List());

export const getTotal = state => getResults(state).size;

export const isLoading = state => state.getIn([SCOPE, 'loading'], false);

export const getResultsByPage = createSelector(
  [getResults, getPage, getPageSize],
  (results, page, size) => results.slice(size * (page - 1), size * page),
);
