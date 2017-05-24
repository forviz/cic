'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getIdentityFromToken = exports.decodeToken = exports.getAccessToken = undefined;

var _jwtDecode = require('jwt-decode');

var _jwtDecode2 = _interopRequireDefault(_jwtDecode);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var getAccessToken = exports.getAccessToken = function getAccessToken(req) {
  var parts = req.headers.authorization.split(' ');
  if (parts.length === 2) {
    var scheme = parts[0];
    var credentials = parts[1];
    if (/^Bearer$/i.test(scheme)) {
      return credentials;
    }
  }
  return false;
};

var decodeToken = exports.decodeToken = function decodeToken(token) {
  return (0, _jwtDecode2.default)(token);
};

var getIdentityFromToken = exports.getIdentityFromToken = function getIdentityFromToken(req) {
  var accessToken = getAccessToken(req);
  var userData = decodeToken(accessToken);
  return userData.sub;
};
//# sourceMappingURL=jwtUtils.js.map