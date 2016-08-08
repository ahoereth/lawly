import { createSelector } from 'reselect';
import { push } from 'react-router-redux';
import { List, Map, fromJS } from 'immutable';

import createReducer from 'store/createReducer';


export const SCOPE = 'search';


// ******************************************************************
// ACTIONS
export const SEARCH = 'search/SEARCH';
export const SEARCHED = 'search/SEARCHED';
export const LOCAL_ONLY = 'search/filter/LOCAL_ONLY';
export const SELECT_PAGE = 'search/SELECT_PAGE';



// ******************************************************************
// REDUCERS
export default createReducer(Map({
  page: 1,
  pageSize: 20,
  query: '',
  results: List(),
  total: 0,
}), {
  [SEARCH]: (state, { payload = '' }) => state.set('query', payload),
  [SEARCHED]: (state, { payload: { results, total } }) =>
    state.merge(Map({ results: fromJS(results || []), total: total || 0 })),
  [SELECT_PAGE]: (state, { payload = 1 }) => state.set('page', payload),
});



// ******************************************************************
// ACTION CREATORS
export const selectPage = (page = 1) => (dispatch, getState) => {
  const query = getState().getIn([SCOPE, 'query'], '');
  const pagePath = page > 1 ? `/${page}` : '';
  dispatch({ type: SELECT_PAGE, payload: page || 1 });
  dispatch(push(`/suche/${query}${pagePath}`));
};

export const search = (query = '') => (dispatch) => {
  dispatch({ type: SEARCH, payload: query });
  dispatch(selectPage(1));
  dispatch({ type: SEARCHED, payload: {} });
  return dispatch({
    type: SEARCHED,
    meta: { debounce: { time: 500 } },
    promise: api => api.search(query),
  });
};



// ******************************************************************
// SELECTORS
export const getQuery = state => state.getIn([SCOPE, 'query'], '');

export const getPage = state => state.getIn([SCOPE, 'page'], 1);

export const getPageSize = state => state.getIn([SCOPE, 'pageSize'], 20);

export const getResults = state => state.getIn([SCOPE, 'results'], List());

export const getTotal = state => state.getIn([SCOPE, 'total'], 0);

export const getResultsByPage = createSelector(
  [getResults, getPage, getPageSize],
  (results, page, size) => results.slice(size * (page - 1), size * page)
);
