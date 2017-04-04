import { fetchUserSpaces } from '../api/cic/spaces';
// import { upload } from '../../api/cic/assets';

export const initApplication = () => {
  return (dispatch) => {
    fetchUserSpaces()
    .then((spaces) => {
      dispatch({
        type: 'USER/SPACES/RECEIVED',
        spaces,
      });
    });
  };
};
