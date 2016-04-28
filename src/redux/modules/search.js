import { createSelector } from 'reselect';
import { push } from 'react-router-redux';
import { fromJS, List, Map } from 'immutable';

import createReducer from '../createReducer';


// ******************************************************************
// ACTIONS
export const SEARCH = 'search/SEARCH';
export const SEARCH_QUERY = 'search/SEARCH_QUERY';
export const SELECT_PAGE = 'search/SELECT_PAGE';



// ******************************************************************
// REDUCERS
export default createReducer(Map({
  page: 1,
  pageSize: 20,
  query: '',
  results: List()
}), {
  [SEARCH]: (state, { payload }) => state.set('results', fromJS(payload)),
  [SEARCH_QUERY]: (state, { payload }) => state.set('query', payload),
  [SELECT_PAGE]: (state, { payload }) => state.set('page', payload),
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
  dispatch({ type: SEARCH_QUERY, payload: query });
  dispatch(selectSearchPage(1));
  dispatch({
    type: SEARCH,
    meta: { debounce: { time: 500 } },
    promise: api => api.get({ name: 'laws', search: query })
  });
};



// ******************************************************************
// SELECTORS
export const getQuery = state => state.getIn(['search', 'query']);

export const getPage = state => state.getIn(['search', 'page']);

export const getPageSize = state => state.getIn(['search', 'pageSize']);

export const getResults = state => state.getIn(['search', 'results'], List());

export const getResultsByPage = createSelector(
  [ getResults, getPage, getPageSize ],
  (laws, page, size) => {
    return ({
      total: laws.size,
      results: laws.slice(size * (page-1), size * page)
    });
  }
);
