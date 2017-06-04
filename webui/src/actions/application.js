import { fetchUserSpaces, fetchUserOrganizations } from '../api/cic/spaces';

export const initWithUser = (userId) => {
  return dispatch => {

    return Promise.all([
      fetchUserOrganizations(userId),
      fetchUserSpaces(userId),
    ]).then(([organizations, spaces]) => {
      console.log('organizations', organizations);
      console.log('spaces', spaces);
      dispatch({
        type: 'USER/ORGANIZATIONS/RECEIVED',
        organizations,
      });

      dispatch({
        type: 'USER/SPACES/RECEIVED',
        spaces,
      });
    });
  }
}
