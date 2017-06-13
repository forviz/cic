import { fetchUserSpaces, fetchUserOrganizations } from '../api/cic/spaces';
import { notification } from 'antd';

// Action Creator
export const initWithUser = (userId, auth) => {
  return dispatch => {
    return Promise.all([
      fetchUserOrganizations(userId),
      fetchUserSpaces(userId),
    ]).then(([organizations, spaces]) => {
      dispatch({
        type: 'USER/ORGANIZATIONS/RECEIVED',
        organizations,
      });

      dispatch({
        type: 'USER/SPACES/RECEIVED',
        spaces,
      });
    })
    .catch((e) => {
      if (e.name === 'jwtTokenExpire') auth.login();
    });
  };
};

// Action Creator
export const updateUserProfile = (profile) => {

  // Action
  return {
    type: 'USER/PROFILE/RECEIVED',
    profile,
  };
};


export const getOrganization = (userId) => {
  return function(dispatch) {

    dispatch({
      type: 'USER/ORGANIZATIONS/RECEIVED',
      organizations: [],
    })

    setTimeout(() => {
      dispatch({
        type: 'USER/SPACES/RECEIVED',
        spaces: [],
      })

    }, 2000);

  }
}

export const handleError = (error) => {
  notification.error({
    message: 'Error',
    description: error.message,
  });
}
