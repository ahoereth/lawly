import { createSelector } from 'reselect';
import { push } from 'react-router-redux';

import { getLaws } from './laws';


// ******************************************************************
// ACTIONS
const SEARCH = 'SEARCH';



// ******************************************************************
// REDUCERS
export default function reducer(
  state = {
    query: '',
  },
  action
) {
  switch (action.type) {
    case SEARCH:
      return {...state,
        query: action.query,
      };
    default:
      return state;
  }
}



// ******************************************************************
// ACTION CREATORS
export const search = (query) => {
  return (dispatch) => {
    dispatch(push('/search/' + query));
    dispatch({ type: SEARCH, query });
  };
};



// ******************************************************************
// SELECTORS
export const getQuery = (state) => (state.search.query || '').toLowerCase();

export const getLawsByQuery = createSelector(
  [ getLaws, getQuery ],
  (laws, query) => laws.filter(law => (
    (law.titel.toLowerCase().indexOf(query) > -1) ||
    (law.groupkey.toLowerCase().indexOf(query) > -1)
  ))
);
