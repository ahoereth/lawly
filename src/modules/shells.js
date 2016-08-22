import { Map } from 'immutable';

import createReducer from '~/store/createReducer';


export const SCOPE = 'shells';



// ******************************************************************
// ACTIONS
export const SET_ACTIVE = 'shells/set';
export const SELECT = 'laws/SELECT';



// ******************************************************************
// REDUCERS
export default createReducer(Map({
  active: false,
}), {
  [SET_ACTIVE]: (state, { payload }) => state.set('active', payload),
});



// ******************************************************************
// ACTION CREATORS
export const renderShells = (state = true) => ({
  type: SET_ACTIVE,
  payload: state,
});


// ******************************************************************
// SELECTORS
export const getShellMode = state => state.getIn([SCOPE, 'active'], false);
