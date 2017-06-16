export const receiveOrganization = (organizationId, organization) => {
  return {
    type: 'ENTITIES/ORGANIZATION/RECEIVED',
    organizationId,
    organization,
  };
};

export const receiveOrganizationMembers = (organizationId, members) => {
  return {
    type: 'ENTITIES/ORGANIZATION/MEMBERS/RECEIVED',
    organizationId,
    members,
  };
};
