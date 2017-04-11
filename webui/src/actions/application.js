import _ from 'lodash';
// const jwtDecode = require('jwt-decode');

import { fetchUserSpaces } from '../api/cic/spaces';

export const initApplication = () => {
  return (dispatch) => {

    // const token = localStorage.getItem('id_token');
    // console.log('token', token);
    // var decoded = jwtDecode(token);
    // console.log('decoded', decoded);

    fetchUserSpaces()
    .then((spaces) => {
      dispatch({
        type: 'USER/SPACES/RECEIVED',
        spaces,
      });
    });
  };
};
