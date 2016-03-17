// ******************************************************************
// ACTIONS
const USER_LOGIN = 'laws/login';
const USER_LOGIN_SUCCESS = 'laws/login/SUCCESS';
const USER_LOGIN_FAIL = 'laws/login/FAIL';



// ******************************************************************
// REDUCERS
export default function reducer(
  state = {
    loggedin: false,
    email: '',
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
        email: action.email,
      };
    case USER_LOGIN_FAIL:
      return {...state,
        loggedin: false,
        email: '',
        error: action.error,
      };
    default:
      return state;
  }
}



// ******************************************************************
// ACTION CREATORS
export const login = (email, password, signup = false) => (dispatch) => {
  email = email ? email.trim() : false;
  password = password ? password.trim() : false;
  if (!email || !password) {
    dispatch({ type: USER_LOGIN_FAIL });
  } else {
    dispatch({
      types: [USER_LOGIN, USER_LOGIN_SUCCESS, USER_LOGIN_FAIL],
      promise: client => client.auth(email, password, signup)
    });
  }
};
