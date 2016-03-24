import { createSelector } from 'reselect';

import { arr2obj } from 'helpers/utils';


// ******************************************************************
// ACTIONS
const USER_LOGIN = 'user/login';
const USER_LOGIN_SUCCESS = 'user/login/SUCCESS';
const USER_LOGIN_FAIL = 'user/login/FAIL';

const USER_LOGOUT = 'user/logout';
const USER_LOGOUT_SUCCESS = 'user/logout/SUCCESS';
const USER_LOGOUT_FAIL = 'user/logout/FAIL';

const STAR = 'user/laws/star';
const STAR_SUCCESS = 'user/laws/star/success';
const STAR_FAIL = 'user/laws/star/fail';



// ******************************************************************
// REDUCERS
export default function reducer(
  state = {
    loggedin: false,
    email: undefined,
    laws: {},
    error: false,
  },
  action
) {
  switch (action.type) {
    case USER_LOGIN:
      return state;
    case USER_LOGIN_SUCCESS:
      return {...state,
        loggedin: true,
        email: action.result.email,
        laws: arr2obj(action.result.laws, 'groupkey'),
        error: false,
      };
    case USER_LOGIN_FAIL:
      return {...state,
        loggedin: false,
        email: undefined,
        laws: {},
        error: action.error,
      };

    case USER_LOGOUT:
      return state;
    case USER_LOGOUT_SUCCESS:
      return {...state,
        loggedin: false,
        email: undefined,
        laws: {},
        error: false,
      };
    case USER_LOGOUT_FAIL: // Can this even occur?
      return state;

    case STAR_SUCCESS:
      return {...state,
        laws: {...state.laws,
          [action.result.groupkey]: action.result,
        },
      };

    default:
      return state;
  }
}



// ******************************************************************
// ACTION CREATORS
export const login = (email, password, signup = false) => (dispatch) => {
  email = email ? email.trim() : false;
  // Server will check for a valid authentication token if no password is set.
  password = password ? password.trim() : undefined;
  if (!email) {
    dispatch({ type: USER_LOGIN_FAIL });
  } else {
    dispatch({
      types: [USER_LOGIN, USER_LOGIN_SUCCESS, USER_LOGIN_FAIL],
      promise: client => client.auth(email, password, signup)
    });
  }
};

export const logout = (email) => (dispatch) => {
  dispatch({
    types: [USER_LOGOUT, USER_LOGOUT_SUCCESS, USER_LOGOUT_FAIL],
    promise: client => client.unauth(email)
  });
};

export const starLaw = (groupkey, state = true) => ({
  types: [STAR, STAR_SUCCESS, STAR_FAIL],
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
  [getUserLaws],
  (userLaws) => Object.keys(userLaws).reduce((laws, key) => {
    if (userLaws[key].starred) { laws[key] = true; }
    return laws;
  }, {})
);
