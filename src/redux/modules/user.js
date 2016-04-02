import { createSelector } from 'reselect';
import Immutable, { Map, Set } from 'immutable';

import createReducer from '../createReducer';
import { isString, omit } from 'helpers/utils';


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
  laws: Map(/*{
    groupkey: {
      enumeration: {
        starred: bool,
      },
    },
  }*/),
  error: false,
}), {
  [LOGIN]: (state, { payload }) => state.merge({
    loggedin: true,
    email: payload.email,
    laws: Immutable.fromJS(payload.laws),
  }),
  [LOGOUT]: (state/*, { payload }*/) => state.merge({
    loggedin: false, email: undefined, laws: Map(), error: undefined
  }),
  [STAR]: (state, { payload }) =>
    state.setIn(
      ['laws', payload.groupkey, payload.enumeration],
      Map(omit(payload, 'groupkey', 'enumeration'))
    )
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

export const star = (law, state = true) => {
  let groupkey, enumeration;
  if (Map.isMap(law)) {
    groupkey = law.get('groupkey');
    enumeration = law.get('enumeration');
  } else if (isString(law)) {
    groupkey = law;
  }

  return {
    type: STAR,
    promise: client => client.put({
      name: 'user_law',
      groupkey,
      enumeration,
      starred: state,
    })
  };
};



// ******************************************************************
// SELECTORS
export const getUser = (state) => state.get('user');

export const getUserLaws = (state) => state.getIn(['user', 'laws']);

export const getIndexStars = createSelector(
  [ getUserLaws ],
  (laws) => Set.fromKeys(laws.filter(law => law.getIn(['0', 'starred'])))
);
