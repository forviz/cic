import { BASE_URL, fetchWithResponse } from './helper';

export const fetchAssetInSpace = (spaceId) => {
  return fetchWithResponse(`${BASE_URL}/spaces/${spaceId}/assets/`, {
    method: 'GET',
  })
  .then((response) => {
    console.log('fetchGetAssetInSpace', response);
    return response;
  });
};

export const fetchGetSingleAsset = (spaceId, assetId) => {
  return fetchWithResponse(`${BASE_URL}/spaces/${spaceId}/assets/${assetId}`, {
    method: 'GET',
  })
  .then((response) => {
    console.log('fetchGetAsset', response);
    return response;
  });
};

export const fetchCreateAsset = (spaceId, contentTypeId, data = {}) => {
  return fetchWithResponse(`${BASE_URL}/spaces/${spaceId}/assets/`, {
    method: 'POST',
    headers: {
      'X-CIC-Content-Type': contentTypeId,
    },
    body: JSON.stringify(data),
  })
  .then((response) => {
    console.log('fetchCreateAsset', response);
    return response;
  });
};


export const fetchUpdateAsset = (spaceId, assetId, fields) => {
  return fetchWithResponse(`${BASE_URL}/spaces/${spaceId}/assets/${assetId}`, {
    method: 'PUT',
    body: JSON.stringify({
      fields,
    }),
  })
  .then((response) => {
    console.log('fetchUpdateAsset', response);
    return response;
  });
};


export const fetchDeleteAsset = (spaceId, assetId) => {
  return fetchWithResponse(`${BASE_URL}/spaces/${spaceId}/assets/${assetId}`, {
    method: 'DELETE',
  })
  .then((response) => {
    console.log('fetchDeleteAsset', response);
    return response;
  });
};
