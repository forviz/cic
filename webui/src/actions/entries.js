import _ from 'lodash';
import { fetchEntryInSpace, fetchGetSingleEntry } from '../api/cic/entries';
import { openNotification } from './notification';
import { getActiveSpaceFromId } from '../selectors';
import { getEntryFetchStatus, getUnFetchedEntryIds } from '../selectors/entities';

export const getEntryInSpace = (spaceId) => {
  return (dispatch) => {
    return fetchEntryInSpace(spaceId)
    .then((res) => {
      const entries = res.items;
      _.forEach(entries, (entry) => {
        dispatch({
          type: 'ENTITIES/ENTRY/RECEIVED',
          item: entry,
        });
      });
      return res;
    });
  };
};

export const getSingleEntryEntity = (spaceId, entryId) => {
  return (dispatch, getState) => {
    const entryStatus = getEntryFetchStatus(getState(), entryId);

    // If haven't loaded, do load it from server
    if (entryStatus !== 'loaded') {
      fetchGetSingleEntry(spaceId, entryId)
      .then((res) => {
        dispatch({
          type: 'ENTITIES/ENTRY/RECEIVED',
          item: res.item,
        });
        openNotification('success', { message: `${_.get(res, 'item.name', 'Entry')} updated` });
        return res;
      });
    }
  };
};

export const getEntries = (spaceId, params) => {
  console.info('getEntries', spaceId, params);
  return (dispatch, getState) => {
    const entryIds = getUnFetchedEntryIds(getState(), spaceId);
    console.log('getUnFetchedEntryIds', entryIds);
    // If haven't loaded, do load it from server
    _.forEach(entryIds, (entryId) => {
      openNotification('info', { message: `fetching Entry ${entryId}` });

      fetchGetSingleEntry(spaceId, entryId)
      .then((res) => {
        dispatch({
          type: 'ENTITIES/ENTRY/RECEIVED',
          item: res.item,
        });
        openNotification('success', { message: `fetching Entry ${entryId} complete` });
        return res;
      });
    });
  };
};
