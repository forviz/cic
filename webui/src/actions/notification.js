import { notification } from 'antd';
const MINWIDTH = 240;

export const openNotification = (type, { message, description }) => {
  notification[type]({
    message,
    description,
    duration: 4,
    placement: 'bottomRight',
    style: {
      minWidth: MINWIDTH,
      marginLeft: 335 - MINWIDTH,
    },
  });
};

export const closeNotification = () => {
  notification.destroy();
};
