import _ from 'lodash';

export const getSpaceFetchStatus = (state, spaceId) => _.get(state, `entities.spaces.fetchStatus.${spaceId}`);
