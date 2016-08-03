import { createSelector } from 'reselect';
import { push } from 'react-router-redux';
import { List, Map } from 'immutable';

import createReducer from '../createReducer';
import localSearch from 'helpers/LocalSearch';
import { getLaws } from './laws';


// ******************************************************************
// ACTIONS
export const SEARCH = 'search/SEARCH';
export const SEARCHED = 'search/SEARCHED';
export const SELECT_PAGE = 'search/SELECT_PAGE';



// ******************************************************************
// REDUCERS
export default createReducer(Map({
  page: 1,
  pageSize: 20,
  query: '',
  results: List(),
}), {
  [SEARCH]: (state, { payload = '' }) => state.set('query', payload),
  [SEARCHED]: (state, { payload }) => state.set('results', List(payload)),
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


export const search = (query = '') => (dispatch, getState) => {
  dispatch({ type: SEARCH, payload: query });
  dispatch(selectSearchPage(1));
  return dispatch({
    type: SEARCHED,
    meta: { debounce: { time: 500 } },
    promise: () => {
      const timer = Date.now();
      return localSearch.search(query).then(result => {
        console.log(`local search timer: ${Date.now() - timer}ms`);
        const laws = getLaws(getState());
        return result.slice(0, 100)
          .map(obj => obj.ref.split('::'))
          .map(([k, e]) => laws.get(k).find(l => l.get('enumeration') === e));
      });
    }
  });

  // dispatch({
  //   type: SEARCHED,
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
