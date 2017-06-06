import { fetchUserSpaces, fetchUserOrganizations } from '../api/cic/spaces';

export const initWithUser = (userId, auth) => {
  return (dispatch) => {
    return Promise.all([
      fetchUserOrganizations(userId),
      fetchUserSpaces(userId),
    ]).then(([organizations, spaces]) => {
      dispatch({
        type: 'USER/ORGANIZATIONS/RECEIVED',
        organizations,
      });

      dispatch({
        type: 'USER/SPACES/RECEIVED',
        spaces,
      });
    })
    .catch((e) => {
      if (e.name === 'jwtTokenExpire') auth.login();
    });
  };
};
