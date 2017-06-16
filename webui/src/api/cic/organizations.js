import { BASE_URL, fetchWithResponse, responseError } from './helper';

export const fetchOrganization = (orgId) => {
  return fetchWithResponse(`${BASE_URL}/organizations/${orgId}`)
  .then((response) => {
    if (response.status === 'SUCCESS') return response;

    throw responseError({
      appMessage: 'Cannot fetch organization',
    });
  });
};
export const fetchOrganizationMembers = (orgId) => {
  return fetchWithResponse(`${BASE_URL}/organizations/${orgId}/members`)
  .then((response) => {
    if (response.status === 'SUCCESS') return response;

    throw responseError({
      appMessage: 'Cannot find members',
    });
  });
};
