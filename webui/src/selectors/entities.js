import _ from 'lodash';
import { getActiveSpaceFromId } from './index';

export const getEntryFetchStatus = (state, entryId) => _.get(state, `entities.entries.fetchStatus.${entryId}`);

export const getUnFetchedEntryIds = (state, spaceId) => {
  console.log('getUnFetchedEntryIds', state, spaceId);
  const space = getActiveSpaceFromId(state, spaceId);
  if (!space) return [];
  console.log(':: space', space);
  const unfetchEntries = _.filter(space.entries, entryId => getEntryFetchStatus(state, entryId) !== 'loaded');
  console.log(':: unfetchEntries', unfetchEntries);
  return unfetchEntries;
};
