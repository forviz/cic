import _ from 'lodash';

export const getOrganizationEntity = (state, organizationId) => {
  return _.get(state, `entities.organizations.entities.${organizationId}`);
};
