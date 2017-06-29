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


// ---------USER APPLICATION

export const fetchGetApplication = () => {
  return fetch(`${process.env.REACT_APP_API_PATH}/application`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })
  .then(response => response.json())
  .then((response) => {
    return response.items;
  }).catch((e) => {
    console.log('error', e);
  });
};

export const fetchDeleteApplication = (id) => {
  return fetch(`${process.env.REACT_APP_API_PATH}/application/${id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
  })
  .then(response => response.json())
  .then((response) => {
    console.log('response DELETE', response);
    return response;
  }).catch((e) => {
    console.log('error', e);
  });
};

export const fetchCreateApplication = (application) => {
  const { name, description, redirectURL } = application;
  let { read, write } = application;
  if (read === undefined) read = false;
  if (write === undefined) write = false;
  return fetch(`${process.env.REACT_APP_API_PATH}/application`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name,
      description,
      redirectURL,
      read,
      write,
    }),
  })
  .then(response => response.json())
  .then((response) => {
    console.log('response CREATE', response);
    return response;
  }).catch((e) => {
    console.log('error', e);
  });
};
