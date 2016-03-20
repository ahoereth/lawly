// ******************************************************************
// ACTIONS
const USER_LOGIN = 'user/login';
const USER_LOGIN_SUCCESS = 'user/login/SUCCESS';
const USER_LOGIN_FAIL = 'user/login/FAIL';

const USER_LOGOUT = 'user/logout';
const USER_LOGOUT_SUCCESS = 'user/logout/SUCCESS';
const USER_LOGOUT_FAIL = 'user/logout/FAIL';


// ******************************************************************
// REDUCERS
export default function reducer(
  state = {
    loggedin: false,
    email: undefined,
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
        error: false,
      };
    case USER_LOGIN_FAIL:
      return {...state,
        loggedin: false,
        email: undefined,
        error: action.error,
      };
    case USER_LOGOUT:
      return state;
    case USER_LOGOUT_SUCCESS:
      return {...state,
        loggedin: false,
        email: undefined,
        error: false,
      };
    case USER_LOGOUT_FAIL: // Can this even occur?
      return state;
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
