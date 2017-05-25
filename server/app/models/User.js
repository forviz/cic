import _ from 'lodash';

const bcrypt = require('bcrypt-nodejs');
const crypto = require('crypto');
const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new mongoose.Schema({
  email: { type: String },
  spaces: [{ type: Schema.Types.ObjectId, ref: 'Space' }],
  organizations: [{ type: Schema.Types.ObjectId, ref: 'Organization' }],
  profile: {
    name: String,
    gender: String,
    location: String,
    website: String,
    picture: String,
  },
  password: String,
  passwordResetToken: String,
  passwordResetExpires: Date,
  identities: [
    {
      provider: String,
      user_id: String,
      connection: String,
      isSocial: { type: Boolean, default: true },
    },
  ],
  facebook: String,
  twitter: String,
  google: String,
  github: String,
  instagram: String,
  linkedin: String,
  steam: String,
  tokens: Array,

}, { timestamps: true });

/**
 * Password hash middleware.
 */
userSchema.pre('save', function save(next) {
  const user = this;
  if (!user.isModified('password')) next();
  bcrypt.genSalt(10, (err, salt) => {
    if (err) { next(err); }
    bcrypt.hash(user.password, salt, null, (err2, hash) => {
      if (err2) { next(err2); }
      user.password = hash;
      next();
    });
  });
});

// export const getProvider = identity => _.head(_.split(identity, '|'));
userSchema.statics.findByIdentity = function findByIdentity(identity, cb) {
  const [identityProvider, identityNumber] = _.split(identity, '|');
  return this.findOne({
    identities: {
      $elemMatch: {
        provider: identityProvider,
        user_id: identityNumber,
      },
    },
  }, cb);
};

/**
 * Helper method for validating user's password.
 */
userSchema.methods.comparePassword = function comparePassword(candidatePassword, cb) {
  bcrypt.compare(candidatePassword, this.password, (err, isMatch) => {
    cb(err, isMatch);
  });
};

/**
 * Helper method for getting user's gravatar.
 */
userSchema.methods.gravatar = function gravatar(size = 200) {
  // if (!size) {
  //   size = 200;
  // }
  if (!this.email) {
    return `https://gravatar.com/avatar/?s=${size}&d=retro`;
  }
  const md5 = crypto.createHash('md5').update(this.email).digest('hex');
  return `https://gravatar.com/avatar/${md5}?s=${size}&d=retro`;
};

const User = mongoose.model('User', userSchema);

module.exports = User;
