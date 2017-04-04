import _ from 'lodash';
import { BASE_URL, fetchWithResponse } from './helper';


export const fetchCreateContentType = (spaceId, { name, identifier, description }) => {
  return fetchWithResponse(`${BASE_URL}/spaces/${spaceId}/content_types/`, {
    method: 'POST',
    body: JSON.stringify({
      name,
      identifier,
      description,
    })
  })
  .then((response) => {
    console.log('createContentType', response);
    return response;
  });
};

export const fetchUpdateContentType = (spaceId, contentTypeId, { name, identifier, description, fields }) => {
  return fetchWithResponse(`${BASE_URL}/spaces/${spaceId}/content_types/${contentTypeId}`, {
    method: 'PUT',
    body: JSON.stringify({
      name,
      identifier,
      description,
      fields,
    })
  })
  .then((response) => {
    console.log('updateContentType', response);
    return response;
  });
};


export const fetchDeleteContentType = (spaceId, contentTypeId) => {
  return fetchWithResponse(`${BASE_URL}/spaces/${spaceId}/content_types/${contentTypeId}`, {
    method: 'DELETE',
  })
  .then((response) => {
    console.log('deleteContentType', response);
    return response;
  });
};
