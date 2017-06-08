/* eslint-disable */
import _ from 'lodash';
import { fetchAssetInSpace, fetchGetSingleAsset, fetchCreateAsset, fetchUpdateAsset, fetchDeleteAsset } from '../../../api/cic/assets';
import { getSpace } from '../../../actions/spaces';

/* List Page */
export const getAssetInSpace = (spaceId) => {
  return (dispatch) => {
    return fetchAssetInSpace(spaceId)
    .then((res) => {
      const entries = res.items;
      _.forEach(entries, entry => {
        dispatch({
          type: 'ENTITIES/ASSET/RECEIVED',
          item: entry,
        });
      });
      return res;
    });
  }
};

export const createEmptyAsset = (spaceId, contentTypeId) => {
  return (dispatch) => {
    return fetchCreateAsset(spaceId, contentTypeId, {})
    .then((res) => {
      const assetId = _.get(res, 'asset._id');
      window.location = `/spaces/${spaceId}/assets/${assetId}`;
      return res;
    });
  }
};

export const deleteAsset = (spaceId, entryId) => {
  return (dispatch) => {
    return fetchDeleteAsset(spaceId, entryId)
    .then((updateResponse) => {
      dispatch(getSpace(spaceId));
      return updateResponse;
    })
  };
};


/* Single Page */
export const updateAsset = (spaceId, assetId, fields) => {
  return (dispatch) => {
    return fetchUpdateAsset(spaceId, assetId, fields)
    .then((updateResponse) => {
      // window.location = `/spaces/${spaceId}/assets/`;
      return updateResponse;
    })
  };
};


export const getSingleAsset = (spaceId, assetId) => {
  return (dispatch) => {
    return fetchGetSingleAsset(spaceId, assetId)
    .then((res) => {
      dispatch({
        type: 'ENTITIES/ASSET/RECEIVED',
        item: res.item,
      });
      return res;
    });
  }
};
