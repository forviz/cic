import _ from 'lodash';

import { fetchUserSpaces } from '../api/cic/spaces';

// export const initApplication = () => {
//   return (dispatch, getState) => {
//     const isAuthenticated = getIsAuthenticated(getState());
//
//     if (isAuthenticated) {
//       fetchUserSpaces()
//       .then((spaces) => {
//         dispatch({
//           type: 'USER/SPACES/RECEIVED',
//           spaces,
//         });
//       });
//     }
//   };
// };

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
