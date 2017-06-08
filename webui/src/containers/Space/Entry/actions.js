import _ from 'lodash';
import { fetchEntryInSpace, fetchCreateEntry, fetchUpdateEntry, fetchDeleteEntry } from '../../../api/cic/entries';
import { getSpace } from '../../../actions/spaces';
import { openNotification } from '../../../actions/notification';

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

export const createEmptyEntry = (spaceId, contentTypeId) => {
  return () => {
    return fetchCreateEntry(spaceId, contentTypeId, {})
    .then(res => res);
  };
};

export const updateEntry = (spaceId, entryId, contentType, fields, status) => {
  return () => {
    return fetchUpdateEntry(spaceId, entryId, contentType._id, fields, status)
    .then((updateResponse) => {
      openNotification('success', {
        message: 'Entry Updated',
        duration: 5,
      });

      return updateResponse;
    })
    .catch((err) => {
      openNotification('error', {
        message: 'Cannot save entry',
        description: err.message,
        duration: 0,
      });
    });
  };
};

export const deleteEntry = (spaceId, entryId) => {
  return (dispatch) => {
    return fetchDeleteEntry(spaceId, entryId)
    .then(() => {
      dispatch(getSpace(spaceId));
      openNotification('success', { message: 'Entry Deleted' });
    });
  };
};
