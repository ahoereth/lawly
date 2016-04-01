import { createSelector } from 'reselect';
import { Map, Set } from 'immutable';

import createReducer from '../createReducer';
import { arr2obj } from 'helpers/utils';


// ******************************************************************
// ACTIONS
export const LOGIN = 'user/LOGIN';
export const LOGOUT = 'user/LOGOUT';
export const STAR = 'user/STAR';



// ******************************************************************
// REDUCERS
export default createReducer(Map({
  loggedin: false,
  email: undefined,
  laws: Map(),
  error: false,
}), {
  [LOGIN]: (state, { payload }) => state.merge({
    loggedin: true,
    email: payload.email,
    laws: Map(arr2obj(payload.laws, 'groupkey', Map)),
  }),
  [LOGOUT]: (state/*, { payload }*/) => state.merge({
    loggedin: false, email: undefined, laws: Map(), error: undefined
  }),
  [STAR]: (state, { payload }) =>
    state.setIn(['laws', payload.groupkey], Map(payload))
});



// ******************************************************************
// ACTION CREATORS
export const login = (email, password, signup = false) => ({
  type: LOGIN,
  promise: client => client.auth(email, password, signup)
});

export const logout = (email) => ({
  type: LOGOUT,
  promise: client => client.unauth(email)
});

export const starLaw = (groupkey, state = true) => ({
  type: STAR,
  promise: client => client.put({ name: 'user_law', groupkey }, {
    starred: state
  })
});



// ******************************************************************
// SELECTORS
export const getUser = (state) => state.get('user');

export const getUserLaws = (state) => state.getIn(['user', 'laws']);

export const getStars = createSelector(
  [ getUserLaws ],
  (userLaws) => Set.fromKeys(userLaws.filter(law => law.get('starred')))
);
