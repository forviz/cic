import fetch from 'isomorphic-fetch';
const jwtDecode = require('jwt-decode');

import { LOGIN_REQUEST, LOGIN_SUCCESS, LOGIN_FAILURE } from '../../constants';

export const requestLogin = (creds) => {
  return {
    type: LOGIN_REQUEST,
    isFetching: true,
    isAuthenticated: false,
    creds
  }
}
export const receiveLogin = (user) => {
  return {
    type: LOGIN_SUCCESS,
    isFetching: false,
    isAuthenticated: true,
    id_token: user.id_token
  }
}

export const loginError = (message) => {
  return {
    type: LOGIN_FAILURE,
    isFetching: false,
    isAuthenticated: false,
    message
  }
}

export const loginUser = (creds) => {

  let config = {
    method: 'POST',
    headers: { 'Content-Type':'application/x-www-form-urlencoded' },
    body: `email=${creds.email}&password=${creds.password}`
  }
  console.log('loginUser', creds);
  return dispatch => {
    // We dispatch requestLogin to kickoff the call to the API
    dispatch(requestLogin(creds));
    return fetch('http://localhost:5000/token/create', config)
      .then(response =>
        response.json()
        .then(user => ({ user, response }))
      ).then(({ user, response }) =>  {
        if (!response.ok) {
          console.log('login error', response);
          // If there was a problem, we want to
          // dispatch the error condition
          dispatch(loginError(user.message));
          return Promise.reject(user);
        }
        else {
          console.log('login success', user, response);
          // If login was successful, set the token in local storage
          localStorage.setItem('id_token', user.token);
          dispatch(receiveLogin(user));

          var decoded = jwtDecode(user.token);
          console.log('decoded', decoded);

          window.location = '/';

        }
      }).catch(err => console.log("Error: ", err))
  }
}

export const loginWithGoogle = () => {
  window.location = 'http://localhost:4000/auth/google';
  // return (dispatch) => {
  //   return fetch('http://localhost:4000/auth/google')
  //   .then(res => {
  //     console.log('Google res', res);
  //   })
  // };
};

export const loginWithFacebook = () => {
  window.location = 'http://localhost:4000/auth/facebook';
  // return (dispatch) => {
  //   return fetch('http://localhost:4000/auth/facebook')
  //   .then(res => {
  //     console.log('Facebook res', res);
  //   })
  // };
};
