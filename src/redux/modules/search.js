import { createSelector } from 'reselect';
import { push } from 'react-router-redux';
import { fromJS, List, Map } from 'immutable';

import createReducer from '../createReducer';
import localSearch from 'helpers/LocalSearch';
import { getLaws } from './laws';


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
  [SEARCH]: (state, { payload: { results = [] } }) => state.set('results', fromJS(results)),
  [SEARCH_QUERY]: (state, { payload = '' }) => state.set('query', payload),
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

/* global window */
let debounce;
export const search = (query = '') => (dispatch, getState) => {
  dispatch({ type: SEARCH_QUERY, payload: query });
  dispatch(selectSearchPage(1));
  window.clearTimeout(debounce);
  debounce = window.setTimeout(() => {
    const timer = Date.now();
    localSearch.search(query).then(result => {
      console.log(`search timer: ${Date.now() - timer}ms`);
      const refs = result.map(obj => obj.ref.split('::'));
      const laws = getLaws(getState());
      const results = refs.slice(0, 100).map(([groupkey, enumeration]) =>
        laws.get(groupkey).find(law => law.get('enumeration') === enumeration)
      );
      dispatch({ type: SEARCH, payload: { results: List(results) } });
    });
  }, 500);

  // dispatch({
  //   type: SEARCH,
  //   meta: { debounce: { time: 500 } },
  //   promise: api => api.get({ name: 'laws', search: query })
  // });
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
