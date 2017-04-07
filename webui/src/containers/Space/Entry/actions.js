import _ from 'lodash';
import { fetchGetSingleEntry, fetchEntryInSpace, fetchCreateEntry, fetchUpdateEntry } from '../../../api/cic/entries';

export const getEntryInSpace = (spaceId) => {
  return (dispatch) => {
    return fetchEntryInSpace(spaceId)
    .then((res) => {

      const entries = res.items;
      _.forEach(entries, entry => {
        dispatch({
          type: 'ENTITIES/ENTRY/RECEIVED',
          item: entry,
        });
      });
      return res;
    });
  }
};

export const getSingleEntry = (spaceId, entryId) => {
  return (dispatch) => {
    return fetchGetSingleEntry(spaceId, entryId)
    .then((res) => {
      dispatch({
        type: 'ENTITIES/ENTRY/RECEIVED',
        item: res.item,
      });
      return res;
    });
  }
};

export const createEmptyEntry = (spaceId, contentTypeId) => {
  return (dispatch) => {
    return fetchCreateEntry(spaceId, contentTypeId, {})
    .then((res) => {
      const entryId = _.get(res, 'entry._id');
      window.location = `/spaces/${spaceId}/entries/${entryId}`;
      return res;
    });
  }
};

export const updateEntry = (spaceId, entryId, contentType, fields) => {
  return (dispatch) => {
    return fetchUpdateEntry(spaceId, entryId, contentType._id, fields)
    .then((updateResponse) => {
      console.log(updateResponse);
    })
  };
};

export const deleteEntry = (spaceId, entryId) => {

};
