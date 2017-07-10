import { createSelector } from 'reselect';
import Immutable, { List, Map } from 'immutable';

import createReducer from '~/store/createReducer';
import { localeCompare } from '~/helpers/utils';
import semverCompare from '~/helpers/semverCompare';
import { getSelection } from './laws';

export const SCOPE = 'user';

// ******************************************************************
// ACTIONS
export const LOGIN = 'user/LOGIN';
export const LOGOUT = 'user/LOGOUT';
export const STAR = 'user/STAR';

// ******************************************************************
// REDUCERS
export default createReducer(
  Map({
    loggedin: false,
    email: undefined,
    laws: List(), // { groupkey: { enumeration: { ...norm } } }
    error: false,
  }),
  {
    [LOGIN]: (state, { payload }) =>
      state.merge({
        loggedin: true,
        email: payload.email,
        laws: Immutable.fromJS(payload.laws || []),
      }),
    [LOGOUT]: state =>
      state.merge({
        loggedin: false,
        email: undefined,
        laws: Map(),
        error: undefined,
      }),
    [STAR]: (state, { payload }) =>
      state.update('laws', laws => {
        const { groupkey, enumeration = '0', ...rest } = payload;
        const targetkey = laws.findKey(
          norm =>
            norm.get('groupkey') === groupkey &&
            norm.get('enumeration') === enumeration,
        );

        // Update existing.
        if (targetkey >= 0) {
          return laws.mergeIn(
            [targetkey],
            Map({ groupkey, enumeration, ...rest }),
          );
        }

        // Add new and resort.
        return laws
          .push(Map({ groupkey, enumeration, ...rest }))
          .sortBy(
            n => [n.get('groupkey'), n.get('enumeration')],
            ([k1, e1], [k2, e2]) =>
              k1 !== k2 ? localeCompare(k1, k2) : semverCompare(e1, e2),
          );
      }),
  },
);

// ******************************************************************
// ACTION CREATORS
export const login = (email, password, signup = false) => ({
  type: LOGIN,
  promise: client => client.auth(email, password, signup),
});

export const logout = (email, deleteUser = false) => ({
  type: LOGOUT,
  promise: client => client.unauth(email, { deleteUser: !!deleteUser }),
});

export const star = (law, state = true) => {
  const { title, groupkey, enumeration } = Map.isMap(law) ? law.toJS() : law;
  return {
    type: STAR,
    payload: { title, groupkey, enumeration, starred: state },
    api: { method: 'put', name: 'user_law' },
  };
};

// ******************************************************************
// SELECTORS
export const getUser = state => state.get(SCOPE);

export const getUserLaws = state => state.getIn([SCOPE, 'laws']);

export const isLoggedin = state => state.getIn([SCOPE, 'loggedin'], false);

export const getStarredUserLaws = createSelector([getUserLaws], laws =>
  laws.filter(norm => norm.get('starred')),
);

export const getIndexStars = createSelector([getStarredUserLaws], laws =>
  laws.reduce((map, norm) => {
    const key = norm.get('groupkey');
    const child = norm.get('enumeration') !== '0';
    const state = map.get(key, null);
    if (state === null) {
      // Not in map yet.
      // Either add as "children only" or "root only".
      return map.set(key, child ? -1 : 0);
    } else if ((state === 0 && child) || (state === -1 && !child)) {
      // Set to "root and children".
      return map.set(key, 1);
    }

    return map;
  }, Map({})),
);

export const getSelectionAnnotations = createSelector(
  [getUserLaws, getSelection],
  (norms, groupkey) =>
    Map(
      norms
        .filter(law => law.get('groupkey') === groupkey)
        .map(norm => [norm.get('enumeration'), norm]),
    ),
);
