const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const organizationSchema = new Schema({
  name: String,
  users: {
    Owners: [{
      type: Schema.Types.ObjectId,
      ref: 'User',
    }],
    Admins: [{
      type: Schema.Types.ObjectId,
      ref: 'User',
    }],
    Members: [{
      type: Schema.Types.ObjectId,
      ref: 'User',
    }],
  },
  spaces: [{
    type: Schema.Types.ObjectId,
    ref: 'Space',
  }],
}, { timestamps: true });

organizationSchema.statics.findByIdentity = function (userId, cb) {
  return this.find({ 'users.Owners': userId }, cb);
};

const Organization = mongoose.model('Organization', organizationSchema);

module.exports = Organization;
