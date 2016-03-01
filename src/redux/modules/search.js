import { createSelector } from 'reselect';
import { push } from 'react-router-redux';

import { getLaws } from './laws';


// ******************************************************************
// ACTIONS
const SEARCH = 'search/SEARCH';
const SELECT_PAGE = 'search/SELECT_PAGE';



// ******************************************************************
// REDUCERS
export default function reducer(
  state = {
    page: 1,
    pageSize: 20,
    query: '',
  },
  action
) {
  switch (action.type) {
    case SEARCH:
      return {...state,
        query: action.query,
      };
    case SELECT_PAGE:
      return {...state,
        page: action.page,
      };
    default:
      return state;
  }
}



// ******************************************************************
// ACTION CREATORS
export const search = (query) => (dispatch) => {
  dispatch({ type: SEARCH, query });
  dispatch({ type: SELECT_PAGE, page: 1 });
  dispatch(push(`/suche/${query}`));
};

export const selectSearchPage = (page = '1') => (dispatch, getState) => {
  const { query } = getState().search;
  dispatch({ type: SELECT_PAGE, page });
  dispatch(push(`/suche/${query}/${page}`));
};



// ******************************************************************
// SELECTORS
export const getQuery = (state) => (state.search.query || '').toLowerCase();

export const getPage = (state) => state.search.page || 1;

export const getPageSize = (state) => state.search.pageSize || 20;

export const getLawsByQuery = createSelector(
  [ getLaws, getQuery ],
  (laws, query) => laws.filter(law => (
    (law.titel.toLowerCase().indexOf(query) > -1) ||
    (law.groupkey.toLowerCase().indexOf(query) > -1)
  ))
);

export const getLawsByQueryAndPage = createSelector(
  [ getLawsByQuery, getPage, getPageSize ],
  (laws, page, size) => ({
    total: laws.length,
    results: laws.slice(size * (page-1), size * page)
  })
);
