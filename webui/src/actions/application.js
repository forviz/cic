import _ from 'lodash';
import { notification } from 'antd';
import { receiveSpace } from './spaces';
import { receiveOrganization } from './organizations';
import { fetchUpdateMyInfo, fetchMyInfo, fetchUserSpaces, fetchUserOrganizations } from '../api/cic/user';

// Action Creator
export const initWithUser = (userId) => {
  return (dispatch) => {
    return fetchMyInfo()
    .then((userResponse) => {
      dispatch({
        type: 'USER/INFO/RECEIVED',
        user: userResponse.user,
      });

      return Promise.all([
        fetchUserOrganizations(userId),
        fetchUserSpaces(userId),
      ]).then(([organizations, spaces]) => {
        // For session/users
        dispatch({
          type: 'USER/ORGANIZATIONS/RECEIVED',
          organizations,
        });

        // For Entities
        _.forEach(organizations, (org) => {
          dispatch(receiveOrganization(org._id, org));
        });

        dispatch({
          type: 'USER/SPACES/RECEIVED',
          spaces,
        });

        _.forEach(spaces, (space) => {
          dispatch(receiveSpace(space._id, space));
        });
      });
    })
    .catch((e) => {
      notification('error', { message: e.message });
    });
  };
};

// Action Creator
export const updateUserProfile = (profile) => {
  console.log('updateProfile', profile);
  return (dispatch) => {
    // Facebook
    const updateProfile = {
      sub: profile.sub,
      name: profile.name,
      firstName: profile.given_name,
      lastName: profile.family_name,
      email: profile.email,
      picture: profile.picture,
      updatedAt: profile.updated_at,
    };

    dispatch({
      type: 'USER/PROFILE/RECEIVED',
      profile,
    });

    return fetchUpdateMyInfo(updateProfile);
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
