'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var request = require('request');
var cloudinary = require('cloudinary');
var fs = require('fs');

/* Cloudinary */
var CLOUDINARY_CLOUDNAME = process.env.CLOUDINARY_CLOUDNAME;
var CLOUDINARY_APIKEY = process.env.CLOUDINARY_APIKEY;
var CLOUDINARY_APISECRET = process.env.CLOUDINARY_APISECRET;

cloudinary.config({
  cloud_name: CLOUDINARY_CLOUDNAME,
  api_key: CLOUDINARY_APIKEY,
  api_secret: CLOUDINARY_APISECRET
});

var upload = function upload(req, res, next) {
  console.log(req.file);
  var file = req.file.path;
  cloudinary.uploader.upload(file, function (result) {
    console.log(result);
    res.json(result);
    fs.unlink(file);
  });
};

var getRealParamKey = function getRealParamKey(key) {
  switch (key) {
    case 'w':
      return 'width';
    case 'h':
      return 'height';
    case 'c':
      return 'crop';
    case 'g':
      return 'gravity';
    default:
      return key;
  }
};

var convertStringToObject = function convertStringToObject(str) {
  return _lodash2.default.reduce(_lodash2.default.split(str, ','), function (all, item) {
    var _$split = _lodash2.default.split(item, '_'),
        _$split2 = _slicedToArray(_$split, 2),
        key = _$split2[0],
        value = _$split2[1];

    var realKey = getRealParamKey(key);
    return _extends({}, all, _defineProperty({}, realKey, value));
  }, {});
};

var getImage = function getImage(req, res, next) {
  var publicId = req.params.public_id;
  var paramString = req.params.param;
  var paramsObject = convertStringToObject(paramString);
  var imgUrl = cloudinary.url(publicId, paramsObject);
  request(imgUrl).pipe(res);
};

module.exports = {
  getImage: getImage,
  upload: upload
};
//# sourceMappingURL=cloudinary.js.map