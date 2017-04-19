import _ from 'lodash';
import { BASE_URL, fetchWithResponse } from './helper';


export const fetchCreateContentType = (spaceId, { name, identifier, description, displayField, fields }) => {
  return fetchWithResponse(`${BASE_URL}/spaces/${spaceId}/content_types/`, {
    method: 'POST',
    body: JSON.stringify({
      name,
      identifier,
      description,
      displayField,
      fields,
    })
  })
  .then((response) => {
    return response;
  });
};

export const fetchUpdateContentType = (spaceId, contentTypeId, { name, identifier, description, displayField, fields }) => {
  return fetchWithResponse(`${BASE_URL}/spaces/${spaceId}/content_types/${contentTypeId}`, {
    method: 'PUT',
    body: JSON.stringify({
      name,
      identifier,
      description,
      displayField,
      fields,
    })
  })
  .then((response) => {
    return response;
  });
};


export const fetchDeleteContentType = (spaceId, contentTypeId) => {
  return fetchWithResponse(`${BASE_URL}/spaces/${spaceId}/content_types/${contentTypeId}`, {
    method: 'DELETE',
  })
  .then((response) => {
    return response;
  });
};
