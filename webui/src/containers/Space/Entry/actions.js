import { fetchUpdateEntry } from '../../../api/cic/entries';

export const updateEntry = (spaceId, entryId, type, fields) => {
  return (dispatch) => {
    return fetchUpdateEntry(spaceId, entryId, type, fields)
    .then((updateResponse) => {
      console.log(updateResponse);
    })
  };
};
