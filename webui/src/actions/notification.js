import { notification } from 'antd';

const MINWIDTH = 300;

export const openNotification = (type, { message, description, duration, placement, key, btn }) => {
  notification[type]({
    message,
    description,
    key,
    btn,
    duration: duration || 4,
    placement: placement || 'bottomRight',
    style: {
      minWidth: MINWIDTH,
      marginLeft: 335 - MINWIDTH,
    },
  });
};

export const closeNotification = () => {
  notification.destroy();
};
