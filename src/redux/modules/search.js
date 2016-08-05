import { createSelector } from 'reselect';
import { push } from 'react-router-redux';
import { List, Map, fromJS } from 'immutable';

import createReducer from '../createReducer';
import { isBoolean } from 'helpers/utils';


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
  search: Map({ total: 0, results: List() }),
}), {
  [SEARCH]: (state, { payload = '' }) => state.set('query', payload),
  [SEARCHED]: (state, { payload }) => state.set('search', fromJS(payload)),
  [SELECT_PAGE]: (state, { payload = 1 }) => state.set('page', payload),
});



// ******************************************************************
// ACTION CREATORS
export const selectSearchPage = (page = 1) => (dispatch, getState) => {
  const query = getQuery(getState());
  const pagePath = page > 1 ? '/' + page : '';
  dispatch({ type: SELECT_PAGE, payload: page || 1 });
  dispatch(push(`/suche/${query}${pagePath}`));
};


export const search = (query = '') => (dispatch) => {
  dispatch({ type: SEARCH, payload: query });
  dispatch(selectSearchPage(1));
  dispatch({ type: SEARCHED, payload: {} });
  dispatch({
    type: SEARCHED,
    meta: { debounce: { time: 500 } },
    promise: api => api.search(query),
  });
};

export const filterLocalOnly = (filters = {}) => (dispatch) => {
  filters = isBoolean(filters) ? { starred: true } : filters;
  dispatch({ type: LOCAL_ONLY, payload: !!filters.starred || false });
  dispatch(selectSearchPage(1));
};



// ******************************************************************
// SELECTORS
export const getQuery = state => state.getIn(['search', 'query'], '');

export const getPageSize = state => state.getIn(['search', 'pageSize'], 20);

export const getPage = state => state.getIn(['search', 'page'], 1);

export const getResults = state => state.getIn(['search', 'search', 'results'], List());

export const getTotal = state => state.getIn(['search', 'search', 'total'], 0);

export const getResultsByPage = createSelector(
  [ getResults, getTotal, getPage, getPageSize ],
  (results, total, page, size) => ({
    total, page,
    results: results.slice(size * (page-1), size * page),
  })
);
