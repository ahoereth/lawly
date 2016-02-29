import { createSelector } from 'reselect';
import { push } from 'react-router-redux';


// ******************************************************************
// ACTIONS
const INDEX = 'laws/fetch/INDEX';
const INDEX_SUCCESS = 'laws/fetch/INDEX_SUCCESS';
const INDEX_FAIL = 'laws/fetch/INDEX_FAIL';

const SINGLE = 'laws/fetch/SINGLE';
const SINGLE_SUCCESS = 'laws/fetch/SINGLE_SUCCESS';
const SINGLE_FAIL = 'laws/fetch/SINGLE_FAIL';

const SELECT_INITIAL = 'laws/SELECT_INITIAL';



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
  },
  action
) {
  switch (action.type) {
    case INDEX:
      return {...state,
        loading: state.loading + 1,
      };
    case INDEX_SUCCESS:
      return {...state,
        loading: state.loading - 1,
        index: action.result.index,
        initials: action.result.initials,
      };
    case INDEX_FAIL:
      return {...state,
        loading: state.loading - 1,
        error: action.error,
      };
    case SINGLE:
      return {...state,
        loading: state.loading + 1,
      };
    case SINGLE_SUCCESS:
      return {...state,
        loading: state.loading - 1,
        groups: {...state.groups,
          [action.result[0].groupkey]: action.result,
        },
      };
    case SINGLE_FAIL:
      return {...state,
        loading: state.loading - 1,
        error: action.error,
      };
    case SELECT_INITIAL:
      return {...state,
        selectedInitial: action.initial,
      };
    default:
      return state;
  }
}



// ******************************************************************
// ACTION CREATORS
export const fetchLawIndex = () => ({
  types: [INDEX, INDEX_SUCCESS, INDEX_FAIL],
  promise: client => client.get('laws/index')
});

export const fetchLaw = (groupkey) => ({
  types: [SINGLE, SINGLE_SUCCESS, SINGLE_FAIL],
  promise: client => client.get('laws/' + groupkey)
});

export const selectLawIndexInitial = (initial = 'A') => (dispatch) => {
  initial = initial.toLowerCase();
  dispatch(push('/gesetze/' + initial));
  dispatch({ type: SELECT_INITIAL, initial });
};



// ******************************************************************
// SELECTORS
export const getLaws = (state) => state.laws.index;

export const getInitial = (state) => state.laws.selectedInitial;

export const getLawsByInitial = createSelector(
  [ getLaws, getInitial ],
  (laws, initial) => laws.filter(law => (
    (law.groupkey[0].toLowerCase() == initial)
  ))
);
