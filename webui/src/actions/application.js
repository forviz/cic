import { fetchUserSpaces } from '../api/cic/spaces';

export const initWithUser = (userId) => {
  return dispatch => {
    return fetchUserSpaces(userId)
    .then((spaces) => {
      dispatch({
        type: 'USER/SPACES/RECEIVED',
        spaces,
      });
    });
  }
}
