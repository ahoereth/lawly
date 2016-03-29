import { createSelector } from 'reselect';
import { push } from 'react-router-redux';
import { Map, OrderedMap } from 'immutable';

import createReducer from '../createReducer';
import { getLawIndex } from './law_index';


// ******************************************************************
// ACTIONS
const SEARCH = 'search/SEARCH';
const SELECT_PAGE = 'search/SELECT_PAGE';



// ******************************************************************
// REDUCERS
export default createReducer(Map({
  page: 1,
  pageSize: 20,
  query: '',
}), {
  [SEARCH]: (state, { payload }) => state.set('query', payload),
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
  dispatch({ type: SEARCH, payload: query || '' });
  dispatch(selectSearchPage(1));
};



// ******************************************************************
// SELECTORS
export const getQuery = state => state.getIn(['search', 'query']);

export const getPage = state => state.getIn(['search', 'page']);

export const getPageSize = state => state.getIn(['search', 'pageSize']);

export const getLawsByQuery = createSelector(
  [ getLawIndex, getQuery ],
  (laws, query) => {
    query = query.toLowerCase();
    return query ? laws.filter((law, key) => (
      (law.get('title').toLowerCase().indexOf(query) > -1) ||
      (key.toLowerCase().indexOf(query) > -1)
    )) : OrderedMap();
  }
);

export const getLawsByQueryAndPage = createSelector(
  [ getLawsByQuery, getPage, getPageSize ],
  (laws, page, size) => ({
    total: laws.size,
    results: laws.slice(size * (page-1), size * page)
  })
);
