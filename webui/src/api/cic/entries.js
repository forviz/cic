import _ from 'lodash';
import { BASE_URL, fetchWithResponse } from './helper';

export const fetchUpdateEntry = (spaceId, entryId, type, fields) => {
  return fetchWithResponse(`${BASE_URL}/spaces/${spaceId}/entries/${entryId}`, {
    method: 'PUT',
    body: JSON.stringify({
      type,
      fields,
    })
  })
  .then((response) => {
    console.log('fetchUpdateEntry', response);
    return response;
  });
};
