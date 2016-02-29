import { createSelector } from 'reselect';


// ******************************************************************
// ACTIONS
const TOC = 'gesetze/fetch/TOC';
const TOC_SUCCESS = 'gesetze/fetch/TOC_SUCCESS';
const TOC_FAIL = 'gesetze/fetch/TOC_FAIL';

const SINGLE = 'gesetze/fetch/SINGLE';
const SINGLE_SUCCESS = 'gesetze/fetch/SINGLE_SUCCESS';
const SINGLE_FAIL = 'gesetze/fetch/SINGLE_FAIL';

const SELECT_INITIAL = 'gesetze/SELECT_INITIAL';



// ******************************************************************
// REDUCERS
export default function reducer(
  state = {
    loading: 0,
    toc: [],
    selectedInitial: null,
    initials: [],
    groups: {},
    error: '',
  },
  action
) {
  switch (action.type) {
    case TOC:
      return {...state,
        loading: state.loading + 1,
      };
    case TOC_SUCCESS:
      return {...state,
        loading: state.loading - 1,
        toc: action.result.toc,
        initials: action.result.initials,
      };
    case TOC_FAIL:
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
        selectedInitial: action.group,
      };
    default:
      return state;
  }
}



// ******************************************************************
// ACTION CREATORS
export function fetchToc() {
  return {
    types: [TOC, TOC_SUCCESS, TOC_FAIL],
    promise: client => client.get('gesetze/toc')
  };
}

export function single(groupkey) {
  return {
    types: [SINGLE, SINGLE_SUCCESS, SINGLE_FAIL],
    promise: client => client.get('gesetze/' + groupkey)
  };
}

export const selectTocInitial = (initial) => ({
  type: SELECT_INITIAL,
  group: initial,
});



// ******************************************************************
// SELECTORS
export const getLaws = (state) => state.gesetze.toc;

export const getInitial = (state) => state.gesetze.selectedInitial;

export const getLawsByInitial = createSelector(
  [ getLaws, getInitial ],
  (laws, initial) => laws.filter(law => (
    (law.groupkey.charAt(0).toUpperCase() == initial)
  ))
);
