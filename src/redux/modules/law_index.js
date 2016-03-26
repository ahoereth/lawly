import { createSelector } from 'reselect';
import { push } from 'react-router-redux';

import { arr2obj, obj2arr, localeCompare } from 'helpers/utils';
import reduceActions from 'helpers/reduceActions';


// ******************************************************************
// ACTIONS
const FETCH = 'law_index/FETCH';
const SELECT_INITIAL = 'law_index/SELECT_INITIAL';
const SELECT_PAGE = 'law_index/SELECT_PAGE';



// ******************************************************************
// REDUCERS
export default reduceActions({
  [FETCH]: (state, { payload }) => ({...state,
    initials: payload.initials,
    laws: arr2obj(payload.index, 'groupkey'),
  }),
  [SELECT_INITIAL]: (state, { payload }) => ({...state, initial: payload }),
  [SELECT_PAGE]: (state, { payload }) => ({...state, page: payload }),
}, {
  laws: {},
  initials: [],
  initial: 'a',
  page: 1,
  pageSize: 20,
  error: undefined,
});



// ******************************************************************
// ACTION CREATORS
export const fetchLawIndex = () => ({
  type: FETCH,
  promise: api => api.get({ name: 'laws' })
});

export const selectLawIndexInitial = (initial = 'a') => (dispatch) => {
  dispatch({ type: SELECT_INITIAL, payload: initial.toLowerCase() });
  dispatch(selectLawIndexPage(1));
};

export const selectLawIndexPage = (page = 1) => (dispatch, getState) => {
  const initial = getInitial(getState());
  const pagePath = page > 1 ? '/' + page : '';
  dispatch(push(`/gesetze/${initial}${pagePath}`));
  dispatch({ type: SELECT_PAGE, payload: page });
};



// ******************************************************************
// SELECTORS
export const getLawIndexRaw = ({ law_index }) => law_index.laws;

export const getInitial = ({ law_index }) => law_index.initial;

export const getPageSize = ({ law_index }) => law_index.pageSize;

export const getPage = ({ law_index }) => law_index.page;

export const getLawIndex = createSelector(
  [ getLawIndexRaw ],
  (laws) => obj2arr(laws).sort((a, b) => localeCompare(a.groupkey, b.groupkey))
);

export const getLawsByInitial = createSelector(
  [ getLawIndex, getInitial ],
  (laws, char) => laws.filter(law => (law.groupkey[0].toLowerCase() == char))
);

export const getLawsByInitialAndPage = createSelector(
  [ getLawsByInitial, getPage, getPageSize ],
  (laws, page, size) => ({
    total: laws.length,
    laws: laws.slice(size * (page-1), size * page)
  })
);
