import _ from 'lodash';
import { getActiveSpaceFromId } from './index';

export const getEntryFetchStatus = (state, entryId) => _.get(state, `entities.entries.fetchStatus.${entryId}`);

export const getUnFetchedEntryIds = (state, spaceId) => {
  const space = getActiveSpaceFromId(state, spaceId);
  if (!space) return [];
  const unfetchEntries = _.filter(space.entries, entryId => getEntryFetchStatus(state, entryId) !== 'loaded');
  return unfetchEntries;
};
