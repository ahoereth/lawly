import { createSelector } from 'reselect';
import { push } from 'react-router-redux';

import { arr2obj } from 'helpers/utils';


// ******************************************************************
// ACTIONS
const INDEX_FETCH = 'laws/index/FETCH';
const INDEX_FETCH_SUCCESS = 'laws/index/FETCH_SUCCESS';
const INDEX_FETCH_FAIL = 'laws/index/FETCH_FAIL';

const INDEX_SELECT_INITIAL = 'laws/index/SELECT_INITIAL';
const INDEX_SELECT_PAGE = 'laws/index/SELECT_PAGE';

const SINGLE_FETCH = 'laws/single/FETCH';
const SINGLE_FETCH_SUCCESS = 'laws/single/FETCH_SUCCESS';
const SINGLE_FETCH_FAIL = 'laws/single/FETCH_FAIL';



// ******************************************************************
// REDUCERS
export default function reducer(
  state = {
    loading: 0,
    index: {},
    selectedInitial: 'a',
    initials: [],
    groups: {},
    error: '',
    indexPage: 1,
    indexPageSize: 20,
  },
  action
) {
  switch (action.type) {
    case INDEX_FETCH:
      return {...state,
        loading: state.loading + 1,
      };
    case INDEX_FETCH_SUCCESS:
      return {...state,
        loading: state.loading - 1,
        index: arr2obj(action.result.index, 'groupkey'),
        initials: action.result.initials,
      };
    case INDEX_FETCH_FAIL:
      return {...state,
        loading: state.loading - 1,
        error: action.error,
      };

    case INDEX_SELECT_INITIAL:
      return {...state,
        selectedInitial: action.initial,
      };
    case INDEX_SELECT_PAGE:
      return {...state,
        indexPage: action.page,
      };

    case SINGLE_FETCH:
      return {...state,
        loading: state.loading + 1,
      };
    case SINGLE_FETCH_SUCCESS:
      return {...state,
        loading: state.loading - 1,
        groups: {...state.groups,
          [action.result[0].groupkey]: action.result,
        },
      };
    case SINGLE_FETCH_FAIL:
      return {...state,
        loading: state.loading - 1,
        error: action.error,
      };

    default:
      return state;
  }
}



// ******************************************************************
// ACTION CREATORS
export const fetchLawIndex = () => ({
  types: [INDEX_FETCH, INDEX_FETCH_SUCCESS, INDEX_FETCH_FAIL],
  promise: client => client.get({ name: 'laws' })
});

export const fetchLaw = (groupkey) => ({
  types: [SINGLE_FETCH, SINGLE_FETCH_SUCCESS, SINGLE_FETCH_FAIL],
  promise: client => client.get({ name: 'law', groupkey })
});

export const selectLawIndexInitial = (initial = 'a') => (dispatch) => {
  initial = initial.toLowerCase();
  dispatch({ type: INDEX_SELECT_INITIAL, initial });
  dispatch({ type: INDEX_SELECT_PAGE, page: 1 });
  dispatch(push('/gesetze/' + initial));
};

export const selectLawIndexPage = (page = 1) => (dispatch, getState) => {
  const { selectedInitial } = getState().laws;
  const pagePath = page > 1 ? '/' + page : '';
  dispatch(push(`/gesetze/${selectedInitial}${pagePath}`));
  dispatch({ type: INDEX_SELECT_PAGE, page });
};



// ******************************************************************
// SELECTORS
export const getLawIndexRaw = (state) => state.laws.index;

export const getInitial = (state) => state.laws.selectedInitial;

export const getPage = (state) => state.laws.indexPage;

export const getPageSize = (state) => state.laws.indexPageSize;

export const getLaws = (state) => state.laws.groups;

/* global window */
const collator = new window.Intl.Collator('de');

export const getLawIndex = createSelector(
  [ getLawIndexRaw ],
  (laws) => Object.keys(laws).map(key => laws[key]).sort((a, b) =>
    collator.compare(a.groupkey, b.groupkey)
    // (a.groupkey.localeCompare(b.groupkey))
  )
);

export const getLawsByInitial = createSelector(
  [ getLawIndex, getInitial ],
  (laws, initial) => laws.filter(law =>
    (law.groupkey[0].toLowerCase() == initial)
  )
);

export const getLawsByInitialAndPage = createSelector(
  [ getLawsByInitial, getPage, getPageSize ],
  (laws, page, size) => ({
    total: laws.length,
    laws: laws.slice(size * (page-1), size * page)
  })
);
