import { createSelector } from 'reselect';
import Immutable, { List, Map } from 'immutable';

import createReducer from '../createReducer';
import { localeCompare } from 'helpers/utils';
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
  [LOGIN]: (state, { payload }) => {
    return state.merge({
      loggedin: true,
      email: payload.email,
      laws: Immutable.fromJS(payload.laws || []),
    });
  },
  [LOGOUT]: (state/*, { payload }*/) => state.merge({
    loggedin: false, email: undefined, laws: Map(), error: undefined
  }),
  [STAR]: (state, { payload }) => {
    return state.update('laws', laws => {
      const { groupkey, enumeration } = payload;
      const key = laws.findKey(norm =>
        norm.get('groupkey') === groupkey &&
        norm.get('enumeration') === enumeration
      );

      if (key >= 0) {
        // Update existing.
        return laws.mergeIn([key], Map(payload));
      } else {
        // Add new and resort.
        return laws.push(Map(payload)).sortBy(
          n => [n.get('groupkey'), n.get('enumeration')],
          ([k1, e1], [k2, e2]) => k1 !== k2 ? localeCompare(k1, k2)
                                            : semverCompare(e1, e2)
        );
      }
    });
  }
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

export const star = (law, state = true) => ({
  type: STAR,
  payload: {
    title: law.get('title'),
    groupkey: law.get('groupkey'),
    enumeration: law.get('enumeration', '0'),
    starred: state
  },
  api: { method: 'put', name: 'user_law' },
});



// ******************************************************************
// SELECTORS
export const getUser = (state) => state.get('user');

export const getUserLaws = (state) => state.getIn(['user', 'laws'])
                                           .filter(norm => norm.get('starred'));

export const getIndexStars = createSelector(
  [ getUserLaws ],
  (laws) => laws.reduce((map, norm) => {
    const key = norm.get('groupkey');
    const child = norm.get('enumeration') !== '0';
    const state = map.get(key, null);
    if (state === null) { // Not in map yet.
      // Either add as "children only" or "root only".
      return map.set(key, child ? -1 : 0);
    } else if ((state === 0 && child) || (state === -1 && !child)) {
      // Set to "root and children".
      return map.set(key, 1);
    } else {
      return map;
    }
  }, Map({}))
);
