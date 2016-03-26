import { createSelector } from 'reselect';

import reduceActions from 'helpers/reduceActions';
import { arr2obj } from 'helpers/utils';


// ******************************************************************
// ACTIONS
const LOGIN = 'user/LOGIN';
const LOGOUT = 'user/LOGOUT';
const STAR = 'user/STAR';



// ******************************************************************
// REDUCERS
export default reduceActions({
  [LOGIN]: (state, { payload }) => ({...state,
      loggedin: true,
      email: payload.email,
      laws: arr2obj(payload.laws, 'groupkey'),
  }),
  [LOGOUT]: (state/*, { payload }*/) => ({...state,
    loggedin: false, email: undefined, error: undefined
  }),
  [STAR]: (state, { payload }) => ({...state,
    [payload.groupkey]: payload,
  }),
}, {
  loggedin: false,
  email: undefined,
  laws: {},
  error: false,
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
export const getUserLaws = ({user}) => {
  return user.laws;
};

export const getStars = createSelector(
  [ getUserLaws ],
  (userLaws) => Object.keys(userLaws).reduce((laws, key) => {
    if (userLaws[key].starred) { laws[key] = true; }
    return laws;
  }, {})
);
