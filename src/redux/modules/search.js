import { push } from 'react-router-redux';


const SEARCH = 'SEARCH';


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


export const search = (query) => {
  return (dispatch) => {
    dispatch(push('/search/' + query));
    dispatch({ type: SEARCH, query });
  };
};
