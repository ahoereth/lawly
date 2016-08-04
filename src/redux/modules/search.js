import { createSelector } from 'reselect';
import { push } from 'react-router-redux';
import { List, Map, fromJS } from 'immutable';

import createReducer from '../createReducer';
import { getLaws } from './laws';
import localSearch from 'helpers/LocalSearch';


// ******************************************************************
// ACTIONS
export const SEARCH = 'search/SEARCH';
export const SEARCHED_REMOTE = 'search/SEARCHED/REMOTE';
export const SEARCHED_LOCAL = 'search/SEARCHED/LOCAL';
export const SELECT_PAGE = 'search/SELECT_PAGE';



// ******************************************************************
// REDUCERS
const searched_reducer = source => (state, { payload: { total, results } }) =>
  state.set(source, Map({ results: fromJS(results || []), total: total || 0 }));

export default createReducer(Map({
  page: 1,
  pageSize: 20,
  query: '',
  local: Map({ total: 0, results: List() }),
  remote: Map({ total: 0, results: List() }),
}), {
  [SEARCH]: (state, { payload = '' }) => state.set('query', payload),
  [SEARCHED_LOCAL]: searched_reducer('local'),
  [SEARCHED_REMOTE]: searched_reducer('remote'),
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

  // Reset results.
  dispatch({ type: SEARCHED_REMOTE, payload: {} });
  dispatch({ type: SEARCHED_LOCAL, payload: {} });

  dispatch({
    type: SEARCHED_REMOTE,
    meta: { debounce: { time: 500 } },
    promise: api => api.get({ name: 'laws', search: query }),
  });

  dispatch({
    type: SEARCHED_LOCAL,
    meta: { debounce: { time: 500 } },
    promise: () => {
      const laws = getLaws(getState());
      return localSearch.search(query, { laws, limit: 100 });
    }
  });
};



// ******************************************************************
// SELECTORS
export const getQuery = state => state.getIn(['search', 'query']);

export const getPageSize = state => state.getIn(['search', 'pageSize']);

const getPage = state => state.getIn(['search', 'page'], 1);

const getResults = source => state => state.getIn(['search', source, 'results'], List());

const getTotal = source => state => state.getIn(['search', source, 'total'], 0);

const getResultsByPage = source => createSelector(
  [getResults(source), getTotal(source), getPage, getPageSize],
  (results, total, page, size) => ({
    total, page,
    results: results.slice(size * (page-1), size * page),
  })
);

export const getLocalResultsByPage = getResultsByPage('local');

export const getRemoteResultsByPage = getResultsByPage('remote');
