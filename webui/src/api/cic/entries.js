import _ from 'lodash';
import { BASE_URL, fetchWithResponse, responseError } from './helper';

export const fetchEntryInSpace = (spaceId) => {
  return fetchWithResponse(`${BASE_URL}/spaces/${spaceId}/entries/`, {
    method: 'GET',
  })
  .then((response) => {
    return response;
  });
};

export const fetchGetSingleEntry = (spaceId, entryId) => {
  return fetchWithResponse(`${BASE_URL}/spaces/${spaceId}/entries/${entryId}`, {
    method: 'GET',
  })
  .then((response) => {
    return response;
  });
};

export const fetchCreateEntry = (spaceId, contentTypeId, data = {}) => {
  return fetchWithResponse(`${BASE_URL}/spaces/${spaceId}/entries/`, {
    method: 'POST',
    headers: {
      'X-CIC-Content-Type': contentTypeId,
    },
    body: JSON.stringify(data),
  })
  .then((response) => {
    return response;
  });
};


export const fetchUpdateEntry = (spaceId, entryId, contentTypeId, fields, status = 'draft') => {
  return fetchWithResponse(`${BASE_URL}/spaces/${spaceId}/entries/${entryId}`, {
    method: 'PUT',
    headers: {
      'X-CIC-Content-Type': contentTypeId,
    },
    body: JSON.stringify({
      fields,
      status,
    }),
  })
  .then((response) => {
    if (response.status === 'SUCCESS') return response;

    throw responseError({
      name: 'Cannot save Entry',
      message: _.join(response.message, ','),
    });
  });
};


export const fetchDeleteEntry = (spaceId, entryId) => {
  return fetchWithResponse(`${BASE_URL}/spaces/${spaceId}/entries/${entryId}`, {
    method: 'DELETE',
  })
  .then((response) => {
    return response;
  });
};
