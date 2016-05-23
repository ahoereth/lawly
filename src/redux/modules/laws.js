import { Map, fromJS } from 'immutable';

import createReducer from '../createReducer';


// ******************************************************************
// ACTIONS
export const FETCH_SINGLE = 'laws/FETCH_SINGLE';



// ******************************************************************
// REDUCERS
export default createReducer(Map({
  laws: Map(), // Map of Lists of Maps
  error: undefined,
}), {
  [FETCH_SINGLE]: (state, { payload }) =>
    state.setIn(['laws', payload[0].groupkey], fromJS(payload))
});



// ******************************************************************
// ACTION CREATORS
export const fetchLaw = (groupkey) => ({
  type: FETCH_SINGLE,
  promise: api => api.get({ name: 'law', groupkey, cachable: true })
});



// ******************************************************************
// SELECTORS
export const getLaws = (state) => state.getIn(['laws', 'laws']);
