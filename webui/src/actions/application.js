import _ from 'lodash';
import { notification } from 'antd';
import { receiveSpace } from './spaces';
import { fetchUpdateMyInfo, fetchMyInfo, fetchUserSpaces, fetchUserOrganizations } from '../api/cic/user';

// Action Creator
export const initWithUser = (userId, auth) => {
  return (dispatch) => {
    return Promise.all([
      fetchMyInfo(),
      fetchUserOrganizations(userId),
      fetchUserSpaces(userId),
    ]).then(([userInfo, organizations, spaces]) => {
      dispatch({
        type: 'USER/INFO/RECEIVED',
        user: userInfo
      });

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
      // if (e.name === 'jwtTokenExpire') auth.login();
    });
  };
};

// Action Creator
export const updateUserProfile = (profile) => {
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
    fetchUpdateMyInfo(updateProfile);
    dispatch({
      type: 'USER/PROFILE/RECEIVED',
      profile,
    });
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
