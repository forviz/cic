import _ from 'lodash';
import { fetchSpace, fetchSpaceEntries } from '../../api/cic/spaces';

export const initWithSpaceId = (spaceId) => {
  return (dispatch) => {
    fetchSpace(spaceId)
    .then((space) => {
      
      return fetchSpaceEntries(space._id)
      .then((entries) => {
        dispatch({
          type: 'SPACE/RECEIVED',
          space: _.assign({}, space, {
            entries,
          }),
        });
      });
    });
  };
};
