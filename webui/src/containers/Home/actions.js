import { fetchUserSpaces, createUserSpace } from '../../api/cic/spaces';
import { upload } from '../../api/cic/assets';

export const initPage = () => {
  return (dispatch) => {
    fetchUserSpaces()
    .then((spaces) => {
      console.log('spaces', spaces);
      dispatch({
        type: 'USER/SPACES/RECEIVED',
        spaces,
      });
    });
  };
};

export const createSpace = (name) => {
  return (dispatch) => {
    createUserSpace(name)
    .then(response => response)
    .then(() => {
      fetchUserSpaces()
      .then((spaces) => {
        dispatch({
          type: 'USER/SPACES/RECEIVED',
          spaces,
        });
      });
    });
  };
};

export const uploadImage = (file) => {
  return () => {
    upload(file)
    .then((response) => {
      console.log('uploadImage', response);
    });
  };
};
