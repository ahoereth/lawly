import { Map } from 'immutable';

import createReducer from '~/store/createReducer';


export const SCOPE = 'core';



// ******************************************************************
// ACTIONS
export const RENDER_SHELLS = 'core/RENDER_SHELLS';
export const UPDATE_AVAILABLE = 'core/UPDATE_AVAILABLE';



// ******************************************************************
// REDUCERS
export default createReducer(Map({
  shells: false,
  update: false,
}), {
  [RENDER_SHELLS]: (state, { payload }) => state.set('shells', payload),
  [UPDATE_AVAILABLE]: (state, { payload }) => state.set('update', payload),
});



// ******************************************************************
// ACTION CREATORS
export const renderShells = (state = true) => ({
  type: RENDER_SHELLS,
  payload: state,
});

export const updateAvailable = () => ({
  type: UPDATE_AVAILABLE,
  payload: true,
});


// ******************************************************************
// SELECTORS
export const getShellMode = state => state.getIn([SCOPE, 'shells'], false);
export const isUpdateAvailable = state => state.getIn([SCOPE, 'update'], false);
