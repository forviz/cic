import _ from 'lodash';

const cloudinary = require('cloudinary');

const CLOUDINARY_CLOUDNAME = 'pitipatdop';
const CLOUDINARY_APIKEY = '647979826422471';
const CLOUDINARY_APISECRET = 'MAie91dIiOb0acRzVkZZM4H1_OQ';

cloudinary.config({
  cloud_name: CLOUDINARY_CLOUDNAME,
  api_key: CLOUDINARY_APIKEY,
  api_secret: CLOUDINARY_APISECRET,
});

// export const createSignature = (data, apiSecret) => {
//   const str = `${_.join(_.map(data, (value, key) => `${key}=${value}`), '&')}${apiSecret}`;
//   const sh1Str = sha1(str);
//   console.log('signature', str, sh1Str);
//   return sh1Str;
// };

export const upload = (req, res) => {
  console.log(req.file);
  const file = req.file.path;
  cloudinary.uploader.upload(file, (result) => {
    console.log(result);
    res.json(result);
  });
};
