import _ from 'lodash';

import { getIsAuthenticated } from '../selectors';
import { fetchUserSpaces } from '../api/cic/spaces';

export const initApplication = () => {
  return (dispatch, getState) => {

    // const queryParam = queryString.parse(location.search);
    // if (queryParam.token) {
    //   localStorage.setItem('id_token', queryParam.token);
    //   window.location = '/';
    // }

    const isAuthenticated = getIsAuthenticated(getState());

    if (isAuthenticated) {
      fetchUserSpaces()
      .then((spaces) => {
        dispatch({
          type: 'USER/SPACES/RECEIVED',
          spaces,
        });
      });
    }
  };
};
