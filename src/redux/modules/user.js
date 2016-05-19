import { createSelector } from 'reselect';
import Immutable, { List, Map, Set } from 'immutable';

import createReducer from '../createReducer';
import { isString, localeCompare } from 'helpers/utils';
import semverCompare from 'helpers/semverCompare';


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
  laws: List(), // { groupkey: { enumeration: { ...norm } } }
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
  [STAR]: (state, { payload: { groupkey, enumeration, ...data } }) => state
    .update('laws', laws => laws
      .delete(laws.find(law =>
        law.get('groupkey') == groupkey &&
        law.get('enumeration') == enumeration
      ))
      .push(Map({ groupkey, enumeration, ...data }))
      .sort((a, b) => {
        if (a.get('groupkey') === b.get('groupkey')) {
          return semverCompare(a.get('enumeration'), b.get('enumeration'));
        } else {
          return localeCompare(a.get('groupkey'), b.get('groupkey'));
        }
      })
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

export const getUserLaws = (state) => state.getIn(['user', 'laws']).filter(norm => norm.get('starred'));

export const getIndexStars = createSelector(
  [ getUserLaws ],
  (laws) => Set(laws.map(law => law.get('groupkey')))
);
