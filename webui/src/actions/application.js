import _ from 'lodash';
import { notification } from 'antd';
import { receiveSpace } from './spaces';
import { fetchUserSpaces, fetchUserOrganizations } from '../api/cic/spaces';

// Action Creator
export const initWithUser = (userId, auth) => {
  return (dispatch) => {
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

      _.forEach(spaces, (space) => {
        dispatch(receiveSpace(space._id, space));
      });
    })
    .catch((e) => {
      console.log('e', e);
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

export const clearUserProfile = () => {
  // Action
  return {
    type: 'USER/PROFILE/CLEAR',
  };
};

export const handleError = (error) => {
  notification.error({
    message: 'Error',
    description: error.message,
  });
};
