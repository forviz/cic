import _ from 'lodash';

const request = require('request');
const cloudinary = require('cloudinary');
const fs = require('fs');


/* Cloudinary */
const CLOUDINARY_CLOUDNAME = process.env.CLOUDINARY_CLOUDNAME;
const CLOUDINARY_APIKEY = process.env.CLOUDINARY_APIKEY;
const CLOUDINARY_APISECRET = process.env.CLOUDINARY_APISECRET;

cloudinary.config({
  cloud_name: CLOUDINARY_CLOUDNAME,
  api_key: CLOUDINARY_APIKEY,
  api_secret: CLOUDINARY_APISECRET,
});

const upload = (req, res, next) => {
  console.log(req.file);
  const file = req.file.path;
  cloudinary.uploader.upload(file, (result) => {
    console.log(result);
    res.json(result);
    fs.unlink(file);
  });
};

const getRealParamKey = (key) => {
  switch (key) {
    case 'w': return 'width';
    case 'h': return 'height';
    case 'c': return 'crop';
    case 'g': return 'gravity';
    default: return key;
  }
}

const convertStringToObject = (str) => {
  return _.reduce(_.split(str, ','), (all, item) => {
    const [key, value] = _.split(item, '_');
    const realKey = getRealParamKey(key);
    return {
      ...all,
      [realKey]: value,
    }
  }, {});
}

const getImage = (req, res, next) => {
  const publicId = req.params.public_id;
  const paramString = req.params.param;
  const paramsObject = convertStringToObject(paramString);
  const imgUrl = cloudinary.url(publicId, paramsObject);
  request(imgUrl).pipe(res);
};


module.exports = {
  getImage,
  upload,
}
