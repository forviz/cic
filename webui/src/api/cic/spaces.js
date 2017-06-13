import _ from 'lodash';
import { cic } from '../../App';
import { BASE_URL, fetchWithResponse, convertToURLParam, responseError } from './helper';

export const fetchInitWithUser = (userId) => {
  return fetchWithResponse(`${BASE_URL}/users/${userId}`)
  .then((response) => {
    console.log('fetchInitWithUser', response);
    if (response) return response;

    throw responseError({
      appMessage: 'Cannot find spaces',
    });
  });
};

export const fetchUserOrganizations = () => {
  return fetchWithResponse(`${BASE_URL}/organizations`)
  .then((response) => {

    // console.log('space', response);
    if (response.status === 'SUCCESS') {
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

export const fetchSpaceEntries = (spaceId) => {
  const urlParam = convertToURLParam({});
  return fetchWithResponse(`${BASE_URL}/spaces/${spaceId}/entries/${urlParam}`)
  .then((response) => {
    // console.log('fetchSpaceEntries', response);
    const entries = _.get(response, 'entries', []);
    if (entries) {
      return entries;
    }

    throw responseError({
      appMessage: 'Cannot find spaces',
    });
  });
};

export const fetchSpace = (spaceId) => {
  // return fetchWithResponse(`${BASE_URL}/spaces/${spaceId}${urlParam}`)
  return cic.getSpace(spaceId)
  .then((response) => {
    console.log('fetchSpace', response);
    const space = _.get(response, 'space');
    // console.log('space', space);
    if (space) {
      return space;
    }
    throw responseError({
      appMessage: 'Cannot find spaces',
    });
  });
};

export const fetchCreateSpace = (name, { organizationId, defaultLocale }) => {
  return fetchWithResponse(`${BASE_URL}/spaces`, {
    method: 'POST',
    body: JSON.stringify({
      name,
      defaultLocale,
      organizationId,
    }),
  })
  .then((response) => {

    if (response.status === 'SUCCESS') return response;

    throw responseError({
      appMessage: 'Cannot create spaces',
    });
  });
};

export const fetchUpdateSpace = (spaceId, { name, defaultLocale }) => {
  return fetchWithResponse(`${BASE_URL}/spaces/${spaceId}`, {
    method: 'PUT',
    body: JSON.stringify({
      name,
      defaultLocale,
    }),
  })
  .then((response) => {
    return response;
  });
};
