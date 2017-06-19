import _ from 'lodash';
import { BASE_URL, fetchWithResponse, responseError } from './helper';

export const fetchUpdateMyInfo = (profile) => {
  return fetchWithResponse(`${BASE_URL}/users/me`, {
    method: 'POST',
    body: JSON.stringify(profile),
  })
  .then((response) => {
    if (response) return response;
    throw responseError({
      appMessage: 'Cannot update user',
    });
  });
};

export const fetchMyInfo = () => {
  return fetchWithResponse(`${BASE_URL}/users/me`)
  .then((response) => {
    if (response) return response;
    throw responseError({
      appMessage: 'Cannot find user',
    });
  });
};

export const fetchUserOrganizations = () => {
  return fetchWithResponse(`${BASE_URL}/organizations`)
  .then((response) => {
    if (_.get(response, 'items')) {
      const organizations = _.get(response, 'items');
      return organizations;
    }

    throw responseError({
      appMessage: 'Cannot find organizations',
    });
  });
};


export const fetchUserSpaces = () => {
  return fetchWithResponse(`${BASE_URL}/spaces`)
  .then((response) => {
    // console.log('space', response);
    if (response.status === 'SUCCESS') {
      const spaces = _.get(response, 'items');
      return spaces;
    }

    throw responseError({
      appMessage: 'Cannot find spaces',
    });
  });
};
