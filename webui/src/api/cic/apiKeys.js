import { BASE_URL, fetchWithResponse } from './helper';

export const fetchGenerateSpaceKey = (spaceId) => {
  return fetchWithResponse(`${BASE_URL}/spaces/${spaceId}/api_keys`, {
    method: 'POST',
  })
  .then((response) => {
    return response;
  });
}

export const fetchUpdateSpaceKey = (spaceId, keyId, { name }) => {
  return fetchWithResponse(`${BASE_URL}/spaces/${spaceId}/api_keys/${keyId}`, {
    method: 'PUT',
    body: JSON.stringify({
      name,
    })
  })
  .then((response) => {
    return response;
  });
}

export const fetchDeleteSpaceKey = (spaceId, keyId) => {
  return fetchWithResponse(`${BASE_URL}/spaces/${spaceId}/api_keys/${keyId}`, {
    method: 'DELETE',
  })
  .then((response) => {
    return response;
  });
}
