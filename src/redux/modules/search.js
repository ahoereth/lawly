import { createSelector } from 'reselect';
import { push } from 'react-router-redux';

import reduceActions from 'helpers/reduceActions';
import { getLawIndex } from './law_index';


// ******************************************************************
// ACTIONS
const SEARCH = 'search/SEARCH';
const SELECT_PAGE = 'search/SELECT_PAGE';



// ******************************************************************
// REDUCERS
export default reduceActions({
  [SEARCH]: (state, { payload }) => ({...state, query: payload }),
  [SELECT_PAGE]: (state, { payload }) => ({...state, page: payload }),
}, {
  page: 1,
  pageSize: 20,
  query: '',
});



// ******************************************************************
// ACTION CREATORS
export const search = (query = '') => (dispatch) => {
  dispatch({ type: SEARCH, payload: query || '' });
  dispatch(selectSearchPage(1));
};

export const selectSearchPage = (page = 1) => (dispatch, getState) => {
  const query = getQuery(getState());
  dispatch({ type: SELECT_PAGE, payload: page || 1 });
  dispatch(push(`/suche/${query}/${page}`));
};



// ******************************************************************
// SELECTORS
export const getQuery = ({ search }) => search.query.toLowerCase();

export const getPage = ({ search }) => search.page;

export const getPageSize = ({ search }) => search.pageSize;

export const getLawsByQuery = createSelector(
  [ getLawIndex, getQuery ],
  (laws, query) => query ? laws.filter(({ title, groupkey }) => (
    (title.toLowerCase().indexOf(query) > -1) ||
    (groupkey.toLowerCase().indexOf(query) > -1)
  )) : []
);

export const getLawsByQueryAndPage = createSelector(
  [ getLawsByQuery, getPage, getPageSize ],
  (laws, page, size) => ({
    total: laws.length,
    results: laws.slice(size * (page-1), size * page)
  })
);
