import { push } from 'react-router-redux';

import { isUndefined } from 'helpers/utils';


const SEARCH = 'SEARCH';
const SEARCH_SUCCESS = 'SEARCH_SUCCESS';
const SEARCH_FAIL = 'SEARCH_FAIL';


export default function reducer(
  state = {
    results: [],
    loading: false,
    query: '',
    error: '',
  },
  action
) {
  switch (action.type) {
    case SEARCH:
      return {...state,
        loading: true,
        query: action.query,
      };
    case SEARCH_SUCCESS:
      return {...state,
        loading: false,
        results: action.results,
      };
    case SEARCH_FAIL:
      return {...state,
        loading: false,
        error: action.error,
      };
    default:
      return state;
  }
}


export function search(query) {
  return (dispatch, getState) => {
    if (isUndefined(query)) {
      return dispatch({ type: SEARCH_FAIL, error: 'No Query' });
    }

    dispatch(push('/search/' + query));
    dispatch({ type: SEARCH, query });

    query = query.toLowerCase();
    const { gesetze } = getState();
    const results = gesetze.toc.filter(law => {
      return (
        (law.titel.toLowerCase().indexOf(query) > -1) ||
        (law.groupkey.toLowerCase().indexOf(query) > -1)
      );
    });

    dispatch({ type: SEARCH_SUCCESS, results });
  };
}
