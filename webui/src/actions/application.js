import { fetchUserSpaces, fetchUserOrganizations } from '../api/cic/spaces';
import { notification } from 'antd';

// Action Creator
export const initWithUser = (userId) => {
  return dispatch => {

    return Promise.all([
      fetchUserOrganizations(userId),
      fetchUserSpaces(userId),
    ]).then(([organizations, spaces]) => {
      console.log('organizations', organizations);
      console.log('spaces', spaces);
      dispatch({
        type: 'USER/ORGANIZATIONS/RECEIVED',
        organizations,
      });

      dispatch({
        type: 'USER/SPACES/RECEIVED',
        spaces,
      });
    }).catch(error => {
      console.error('initWithUser error', error);
      handleError(error);
    });
  }
}

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
