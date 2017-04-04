import _ from 'lodash';
import { fetchWithResponse } from './helper';

const sha1 = require('sha1');

const CLOUDINARY_CLOUDNAME = 'pitipatdop';
const CLOUDINARY_APIKEY = '647979826422471';
const CLOUDINARY_APISECRET = 'MAie91dIiOb0acRzVkZZM4H1_OQ';

export const createSignature = (data, apiSecret) => {
  const str = `${_.join(_.map(data, (value, key) => `${key}=${value}`), '&')}${apiSecret}`;
  const sh1Str = sha1(str);
  console.log('signature', str, sh1Str);
  return sh1Str;
};

export const upload = (file) => {

  const timestamp = Date.now();

  const data = {
    timestamp,
  };

  data.signature = createSignature(data, CLOUDINARY_APISECRET);
  data.file = file;
  data.api_key = CLOUDINARY_APIKEY;

  return fetchWithResponse(`https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUDNAME}/image/upload`, {
    method: 'POST',
    body: JSON.stringify()
  })
  .then((response) => {
    console.log('upload', response);
    return response;
  });
};
