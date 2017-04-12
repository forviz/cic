import { fetchSpace, fetchCreateSpace, fetchUpdateSpace } from '../api/cic/spaces';
// import { upload } from '../../api/cic/assets';

// Fetch Space Info
export const getSpace = (spaceId) => {
  return (dispatch) => {
    fetchSpace(spaceId)
    .then((space) => {
      dispatch({
        type: 'SPACE/UPDATE/RECEIVED',
        spaceId,
        space,
      });
    });
  };
};


export const createNewSpace = (name, { defaultLocale }) => {

  return (dispatch) => {
    return fetchCreateSpace(name, { defaultLocale })
    .then((res) => {
      console.log('createSpace', res);
    });
  };
};

export const updateSpace = (spaceId, { name, defaultLocale }) => {
  return (dispatch) => {
    fetchUpdateSpace(spaceId, { name, defaultLocale })
    .then((res) => {
      console.log('updateSpace', res);
    });
  };
};
