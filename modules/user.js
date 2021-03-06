import { post } from 'utils/request';

// CONSTANTS
const SET_USER = 'SET_USER';
const REMOVE_USER = 'REMOVE_USER';
const FORGOT_PASSWORD = 'FORGOT_PASSWORD';
const RESET_PASSWORD = 'RESET_PASSWORD';

// REDUCER
const initialState = {};

export default function (state = initialState, action) {
  switch (action.type) {
    case SET_USER:
      return Object.assign({}, state, action.payload);
    case REMOVE_USER:
      return Object.assign({}, state, { logged: false, auth_token: null, forgot: null });
    case FORGOT_PASSWORD:
      return Object.assign({}, state, { forgot: action.payload });
    case RESET_PASSWORD:
      return Object.assign({}, state, { reset: action.payload });
    default:
      return state;
  }
}


// ACTIONS
export function setUser(user) {
  return {
    type: SET_USER,
    payload: Object.assign({}, user,
      { logged: !!(user && user.auth_token), forgot: null, reset: null })
  };
}

export function login({ email, password }) {
  return (dispatch) => {
    post({
      url: '/login',
      type: 'POST',
      body: { email, password },
      headers: [
        {
          key: 'Content-Type',
          value: 'application/json'
        }
      ],
      onSuccess: (response) => {
        // Dispatch action
        dispatch({
          type: SET_USER,
          payload: Object.assign({}, response,
            { logged: !!(response && response.auth_token), forgot: null, reset: null })
        });
      },
      onError: () => {
        dispatch({ type: SET_USER, payload: {} });
      }
    });
  };
}

// export function login({ email, password }) {
//   return (dispatch) => {
//     post({
//       url: `${process.env.KENYA_API}/auth`,
//       type: 'POST',
//       body: { email, password },
//       headers: [
//         {
//           key: 'Content-Type',
//           value: 'application/json'
//         }
//       ],
//       onSuccess: (response) => {
//         localStorage.setItem('token', response.auth_token);
//         // Set cookie
//         Cookies.set('user', JSON.stringify(response));
//         // Dispatch action
//         dispatch({ type: SET_USER, payload: { user: response, logged: true } });
//       },
//       onError: () => {
//         localStorage.setItem('token', '');
//         dispatch({ type: SET_USER, payload: { user: {}, logged: false } });
//       }
//     });
//   };
// }

export function logout() {
  return (dispatch) => {
    // localStorage.setItem('token', '');

    // Dispatch action
    dispatch({ type: REMOVE_USER });
  };
  // return dispatch => new Promise((resolve, reject) => {
  //   post({
  //     url: `${process.env.KENYA_API}/logout`,
  //     type: 'POST',
  //     body: {},
  //     headers: [{
  //       key: 'Content-Type',
  //       value: 'application/json'
  //     }, {
  //       key: 'KENYA-API-KEY',
  //       value: process.env.KENYA_API_KEY
  //     }],
  //     onSuccess: (response) => {
  //       // Set cookie
  //       Cookies.remove('user');
  //
  //       // Dispatch action
  //       dispatch({ type: SET_USER, payload: {} });
  //
  //       resolve(response);
  //     },
  //     onError: (error) => {
  //       reject(error);
  //     }
  //   });
  // });
}

export function forgotPassword(email) {
  return (dispatch) => {
    post({
      url: `${process.env.KENYA_API}/forgot-password`,
      type: 'POST',
      body: { email },
      headers: [
        {
          key: 'Content-Type',
          value: 'application/json'
        }
      ],
      onSuccess: (data) => {
        // Dispatch action
        dispatch({ type: FORGOT_PASSWORD, payload: data });
      },
      onError: (err) => {
        dispatch({ type: FORGOT_PASSWORD, payload: { error: err || true } });
      }
    });
  };
}

export function resetPassword({ newPassword, token }) {
  return (dispatch) => {
    post({
      url: `${process.env.KENYA_API}/reset-password`,
      type: 'POST',
      body: {
        password: newPassword,
        password_confirmation: newPassword,
        token
      },
      headers: [
        {
          key: 'Content-Type',
          value: 'application/json'
        }
      ],
      onSuccess: (data) => {
        // Dispatch action
        dispatch({ type: RESET_PASSWORD, payload: data });
      },
      onError: (err) => {
        dispatch({ type: RESET_PASSWORD, payload: { error: err || true } });
      }
    });
  };
}
