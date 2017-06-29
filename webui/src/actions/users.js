import { notification } from 'antd';
import { fetchGetApplication } from '../api/cic/user';

export const getApplicationSuccess = (applications) => {
  return {
    type: 'USER/APPLICATION/RECEIVED',
    applications,
  };
};

export const getApplication = () => {
  return (dispatch) => {
    return fetchGetApplication()
    .then((result) => {
      if (result.status === 'ERROR') notification.error({ message: result.status, description: result.message });

      dispatch(getApplicationSuccess(result));
    });
  };
};

export const deleteApplicationSuccess = ({ status, _id }) => {
  return {
    type: 'USER/APPLICATION/DELETE',
    status,
    _id,
  };
};

export const createApplicationSuccess = ({ status, item }) => {
  return {
    type: 'USER/APPLICATION/CREATE',
    status,
    item,
  };
};
