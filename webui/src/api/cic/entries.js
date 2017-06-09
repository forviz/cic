import _ from 'lodash';
import { BASE_URL, fetchWithResponse } from './helper';

/*
param = {
  content_type: String,
  status: String,
  query: value
}
*/

const convertToURLParam = (paramObj) => {
  if (_.isEmpty(paramObj)) return '';
  return `?${_.join(_.map(paramObj, (value, key) => `${key}=${encodeURI(value)}`), '&')}`;
};

export const fetchEntryInSpace = (spaceId, params = {}) => {
  return fetchWithResponse(`${BASE_URL}/spaces/${spaceId}/entries/${convertToURLParam(params)}`, {
    method: 'GET',
  })
  .then((response) => {
    console.log('fetchGetEntryInSpace', response);
    return response;
  });
};

export const fetchGetSingleEntry = (spaceId, entryId) => {
  return fetchWithResponse(`${BASE_URL}/spaces/${spaceId}/entries/${entryId}`, {
    method: 'GET',
  })
  .then((response) => {
    console.log('fetchGetEntry', response);
    return response;
  });
}

export const fetchCreateEntry = (spaceId, contentTypeId, data = {}) => {
  return fetchWithResponse(`${BASE_URL}/spaces/${spaceId}/entries/`, {
    method: 'POST',
    headers: {
      'X-CIC-Content-Type': contentTypeId,
    },
    body: JSON.stringify(data)
  })
  .then((response) => {
    console.log('fetchCreateEntry', response);
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
      fields: fields,
      status: status,
    }),
  })
  .then((response) => {
    console.log('fetchUpdateEntry', response);
    return response;
  });
};


export const fetchDeleteEntry = (spaceId, entryId, contentTypeId, fields) => {
  return fetchWithResponse(`${BASE_URL}/spaces/${spaceId}/entries/${entryId}`, {
    method: 'DELETE',
  })
  .then((response) => {
    console.log('fetchDeleteEntry', response);
    return response;
  });
};
