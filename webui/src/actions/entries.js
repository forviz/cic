import _ from 'lodash';
import { fetchEntryInSpace, fetchGetSingleEntry } from '../api/cic/entries';
import { getEntryFetchStatus } from '../selectors/entities';

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
        return res;
      });
    }
  };
};
