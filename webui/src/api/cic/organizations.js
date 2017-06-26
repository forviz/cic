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

export const fetchCreateOrganization = (name) => {
  return fetchWithResponse(`${BASE_URL}/organizations`, {
    method: 'POST',
    body: JSON.stringify({ name }),
  })
  .then((response) => {
    if (response.status === 'SUCCESS') return response;

    throw responseError({
      appMessage: response.message,
    });
  });
};

export const fetchDeleteMemberOrganization = (organizationId, userId) => {
  return fetchWithResponse(`${BASE_URL}/organizations/${organizationId}/members/${userId}`, {
    method: 'DELETE',
  })
  .then((response) => {
    if (response.status === 'SUCCESS') return response;

    throw responseError({
      appMessage: response.message,
    });
  });
};

export const fetchCreateMember = (organizationId, email, { role }) => {
  return fetchWithResponse(`${BASE_URL}/organizations/${organizationId}/members/`, {
    method: 'POST',
    body: JSON.stringify({
      email,
      role,
    }),
  })
  .then((response) => {
    if (response.status === 'SUCCESS') return response;

    throw responseError({
      appMessage: response.message,
    });
  });
};

export const fetchRemoveMember = (organizationId, userId) => {
  return fetchWithResponse(`${BASE_URL}/organizations/${organizationId}/members/${userId}`, {
    method: 'DELETE',
  })
  .then((response) => {
    if (response.status === 'SUCCESS') return response;

    throw responseError({
      appMessage: response.message,
    });
  });
};
