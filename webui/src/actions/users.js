export const LOGIN_REQUEST = 'LOGIN_REQUEST';
export const LOGIN_SUCCESS = 'LOGIN_SUCCESS';
export const LOGIN_FAILURE = 'LOGIN_FAILURE';
export const LOGOUT_REQUEST = 'LOGOUT_REQUEST';
export const LOGOUT_SUCCESS = 'LOGOUT_SUCCESS';
export const LOGOUT_FAILURE = 'LOGOUT_FAILURE';


export const login = () => {
  window.location = `http://localhost:5000/login?redirect=${window.location}`;

  return {
    type: LOGOUT_REQUEST,
    isFetching: true,
    isAuthenticated: false
  }
}

export const logout = () => {
  return (dispatch) => {

    localStorage.removeItem('id_token');

    dispatch({
      type: LOGOUT_REQUEST,
      isFetching: true,
      isAuthenticated: true
    });

    window.location = `http://localhost:5000/logout?redirect=${window.location}`;

  }
}
