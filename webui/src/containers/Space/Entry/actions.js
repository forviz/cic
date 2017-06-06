import _ from 'lodash';
import { fetchGetSingleEntry, fetchEntryInSpace, fetchCreateEntry, fetchUpdateEntry, fetchDeleteEntry } from '../../../api/cic/entries';
import { getSpace } from '../../../actions/spaces';
import { openNotification } from '../../../actions/notification';

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

export const updateEntry = (spaceId, entryId, contentType, fields, status) => {
  return (dispatch) => {
    return fetchUpdateEntry(spaceId, entryId, contentType._id, fields, status)
    .then((updateResponse) => {
      openNotification('success', { message: 'Entry Updated' });
      window.location = `/spaces/${spaceId}/entries/`;
      return updateResponse;
    })
  };
};

export const deleteEntry = (spaceId, entryId) => {
  return (dispatch) => {
    return fetchDeleteEntry(spaceId, entryId)
    .then((deleteResponse) => {
      console.log(deleteResponse);
      dispatch(getSpace(spaceId));
      openNotification('success', { message: 'Entry Deleted' });

    })
  };
};
