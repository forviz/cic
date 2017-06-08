import _ from 'lodash';
import { fetchGenerateSpaceKey, fetchUpdateSpaceKey, fetchDeleteSpaceKey } from '../../../api/cic/apiKeys';
import { openNotification } from '../../../actions/notification';

// ApiKeys
export const createApiKey = (spaceId, his) => {
  return () => {
    return fetchGenerateSpaceKey(spaceId)
    .then((res) => {
      const keyId = _.get(res, 'item._id');
      his.push(`/spaces/${spaceId}/api/keys/${keyId}`);
      return res;
    });
  };
};

export const updateApiKey = (spaceId, keyId, { name }, his) => {
  return () => {
    return fetchUpdateSpaceKey(spaceId, keyId, { name })
    .then((res) => {
      his.push(`/spaces/${spaceId}/api/keys/`);
      return res;
    });
  };
};

export const deleteApiKey = (spaceId, keyId) => {
  return () => {
    return fetchDeleteSpaceKey(spaceId, keyId)
    .then((res) => {
      openNotification('success', { message: 'API Key deleted' });
      return res;
    });
  };
};
