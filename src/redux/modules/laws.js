import { createSelector } from 'reselect';
import { push } from 'react-router-redux';


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
    index: [],
    selectedInitial: undefined,
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
        index: action.result.index,
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
  promise: client => client.get('laws/index')
});

export const fetchLaw = (groupkey) => ({
  types: [SINGLE_FETCH, SINGLE_FETCH_SUCCESS, SINGLE_FETCH_FAIL],
  promise: client => client.get('laws/' + groupkey)
});

export const selectLawIndexInitial = (initial = 'A') => (dispatch) => {
  initial = initial.toLowerCase();
  dispatch(push('/gesetze/' + initial));
  dispatch({ type: INDEX_SELECT_INITIAL, initial });
};

export const selectLawIndexPage = (page = '1') => (dispatch, getState) => {
  const { selectedInitial } = getState().laws;
  dispatch(push(`/gesetze/${selectedInitial}/${page}`));
  dispatch({ type: INDEX_SELECT_PAGE, page });
};



// ******************************************************************
// SELECTORS
export const getLaws = (state) => state.laws.index;

export const getInitial = (state) => state.laws.selectedInitial;

export const getPage = (state) => state.laws.indexPage;

export const getPageSize = (state) => state.laws.indexPageSize;

export const getLawsByInitial = createSelector(
  [ getLaws, getInitial ],
  (laws, initial) => laws.filter(law => (
    (law.groupkey[0].toLowerCase() == initial)
  ))
);

export const getLawsByPage = createSelector(
  [ getLaws, getPage, getPageSize ],
  (laws, page, size) => laws.slice(size * (page-1), size)
);

export const getLawsByInitialAndPage = createSelector(
  [ getLawsByInitial, getPage, getPageSize ],
  (laws, page, size) => ({
    total: laws.length,
    laws: laws.slice(size * (page-1), size * page)
  })
);
