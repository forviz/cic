import fetch from 'isomorphic-fetch';
import _ from 'lodash';

export const BASE_URL = process.env.REACT_APP_API_PATH;

export const getValue = (obj) => {
  if (_.isString(obj)) return obj;
  if (_.isString(_.get(obj, 'value'))) return _.get(obj, 'value');
  return '';
};

export const convertToURLParam = data => `?${_.join(_.map(data, (value, key) => `${key}=${value}`), '&')}`;

class AppError extends Error {
  constructor({ type, code, name, message, appMessage, serviceMessage, trxId, context }) {
    super(appMessage);
    this.name = name;
    this.message = message;

    this.type = type || 'ERROR';
    this.code = code;
    this.appMessage = appMessage;
    this.serviceMessage = serviceMessage;
    this.trxId = trxId;
    this.context = context;

    if (typeof Error.captureStackTrace === 'function') {
      Error.captureStackTrace(this, this.constructor);
    } else {
      this.stack = (new Error(appMessage)).stack;
    }
  }
}

export const appError = ({ code, name, appMessage, debugMessage, serviceMessage, trxId, context }) => {
  return new AppError({
    type: 'ERROR',
    error: true,
    name: !_.isEmpty(name) ? name : 'Error',
    appMessage: !_.isEmpty(appMessage) ? appMessage : serviceMessage,
    debugMessage: debugMessage || serviceMessage,
    code,
    serviceMessage,
    trxId,
    context,
  });
};

export const appWarning = message => new AppError({ appMessage: message, type: 'WARNING', name: 'Warning' });
export const redirectionError = props => new AppError({ ...props, code: 300, name: !_.isEmpty(props.name) ? props.name : 'Redirection Error' });
export const clientError = props => new AppError({ ...props, code: 400, name: !_.isEmpty(props.name) ? props.name : 'Client Error' });
export const serverError = props => new AppError({ ...props, code: 500, name: !_.isEmpty(props.name) ? props.name : 'Server Error' });
export const responseError = props => new AppError({ ...props, code: 600, name: !_.isEmpty(props.name) ? props.name : 'Response Error' });
export const unauthorizeError = props => new AppError({ ...props, code: 401, name: !_.isEmpty(props.name) ? props.name : 'Unauthorize' });

export function prepareRequest(request) {
  const BEARER_TOKEN = localStorage.getItem('access_token');
  const headers = {
    Authorization: `Bearer ${BEARER_TOKEN}`,
    'Content-Type': 'application/json',
  };

  return {
    method: _.get(request, 'method', 'GET'),
    credentials: 'same-origin',
    headers: {
      ...headers,
      ..._.get(request, 'headers'),
    },
    body: _.get(request, 'body'),
  };
}

export const fetchWithResponse = (url, params) => {
  const options = {
    timeoutMS: _.get(params, 'timeout') || 30000,
  };

  const timeout = new Promise((resolve, reject) => {
    const timeoutError = clientError({ name: 'TimeoutError' });
    setTimeout(reject, options.timeoutMS, timeoutError);
  });

  const _fetch = new Promise((resolve, reject) => {
    fetch(url, prepareRequest(params))
    .then((response) => {
      if (response.status === 401) {
        return reject(unauthorizeError({ name: 'jwtTokenExpire' }));
      }

      if (response.status >= 200 && response.status <= 299) {
        return resolve(response.json());
      }

      // ### 3XX Redirection
      if (response.status >= 300 && response.status <= 399) {
        return reject(redirectionError({ name: 'RedirectionError' }));
      }

      // ### 4XX Redirection
      if (response.status >= 400 && response.status <= 499) {
        return reject(clientError({ name: 'ClientError' }));
      }

      if (response.status >= 500 && response.status <= 599) {
        return resolve(response.json());
      }
      return reject(serverError({ name: 'UnknownError' }));
    });
  });
  return Promise.race([timeout, _fetch]);
};
