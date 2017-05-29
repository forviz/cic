'use strict';

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var bcrypt = require('bcrypt-nodejs');
var crypto = require('crypto');
var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var userSchema = new mongoose.Schema({
  email: { type: String },
  spaces: [{ type: Schema.Types.ObjectId, ref: 'Space' }],
  organizations: [{ type: Schema.Types.ObjectId, ref: 'Organization' }],
  profile: {
    name: String,
    gender: String,
    location: String,
    website: String,
    picture: String
  },
  password: String,
  passwordResetToken: String,
  passwordResetExpires: Date,
  identities: [{
    provider: String,
    user_id: String,
    connection: String,
    isSocial: { type: Boolean, default: true }
  }],
  facebook: String,
  twitter: String,
  google: String,
  github: String,
  instagram: String,
  linkedin: String,
  steam: String,
  tokens: Array

}, { timestamps: true });

/**
 * Password hash middleware.
 */
userSchema.pre('save', function save(next) {
  var user = this;
  if (!user.isModified('password')) next();
  bcrypt.genSalt(10, function (err, salt) {
    if (err) {
      next(err);
    }
    bcrypt.hash(user.password, salt, null, function (err2, hash) {
      if (err2) {
        next(err2);
      }
      user.password = hash;
      next();
    });
  });
});

// export const getProvider = identity => _.head(_.split(identity, '|'));
userSchema.statics.findByIdentity = function findByIdentity(identity, cb) {
  var _$split = _lodash2.default.split(identity, '|'),
      _$split2 = _slicedToArray(_$split, 2),
      identityProvider = _$split2[0],
      identityNumber = _$split2[1];

  return this.findOne({
    identities: {
      $elemMatch: {
        provider: identityProvider,
        user_id: identityNumber
      }
    }
  }, cb);
};

/**
 * Helper method for validating user's password.
 */
userSchema.methods.comparePassword = function comparePassword(candidatePassword, cb) {
  bcrypt.compare(candidatePassword, this.password, function (err, isMatch) {
    cb(err, isMatch);
  });
};

/**
 * Helper method for getting user's gravatar.
 */
userSchema.methods.gravatar = function gravatar() {
  var size = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 200;

  // if (!size) {
  //   size = 200;
  // }
  if (!this.email) {
    return 'https://gravatar.com/avatar/?s=' + size + '&d=retro';
  }
  var md5 = crypto.createHash('md5').update(this.email).digest('hex');
  return 'https://gravatar.com/avatar/' + md5 + '?s=' + size + '&d=retro';
};

var User = mongoose.model('User', userSchema);

module.exports = User;
//# sourceMappingURL=User.js.map