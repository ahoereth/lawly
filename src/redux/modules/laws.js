import reduceActions from 'helpers/reduceActions';


// ******************************************************************
// ACTIONS
const FETCH_SINGLE = 'laws/FETCH_SINGLE';



// ******************************************************************
// REDUCERS
export default reduceActions({
  [FETCH_SINGLE]: (state, { payload }) => ({...state, laws: {...state.laws,
    [payload[0].groupkey]: payload,
  }})
}, {
  laws: {},
  error: undefined,
});



// ******************************************************************
// ACTION CREATORS
export const fetchLaw = (groupkey) => ({
  types: FETCH_SINGLE,
  promise: api => api.get({ name: 'law', groupkey })
});



// ******************************************************************
// SELECTORS
export const getLaws = ({ laws }) => laws.laws;
