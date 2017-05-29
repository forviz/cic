'use strict';

var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var organizationSchema = new Schema({
  name: String,
  users: {
    Owners: [{
      type: Schema.Types.ObjectId,
      ref: 'User'
    }],
    Admins: [{
      type: Schema.Types.ObjectId,
      ref: 'User'
    }],
    Members: [{
      type: Schema.Types.ObjectId,
      ref: 'User'
    }]
  },
  spaces: [{
    type: Schema.Types.ObjectId,
    ref: 'Space'
  }]
}, { timestamps: true });

organizationSchema.statics.findByIdentity = function findByIdentity(userId, cb) {
  return this.find({ 'users.Owners': userId }, cb);
};

var Organization = mongoose.model('Organization', organizationSchema);

module.exports = Organization;
//# sourceMappingURL=Organization.js.map