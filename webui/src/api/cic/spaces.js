import _ from 'lodash';
import { cic } from '../../App';
import { BASE_URL, fetchWithResponse, convertToURLParam, responseError } from './helper';

export const fetchInitWithUser = (userId) => {
  return fetchWithResponse(`${BASE_URL}/users/${userId}`)
  .then((response) => {
    if (response) return response;
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
    return response;
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

export const fetchDeleteSpace = (spaceId) => {
  return fetchWithResponse(`${BASE_URL}/spaces/${spaceId}`, {
    method: 'DELETE',
  })
  .then((response) => {
    return response;
  });
};
