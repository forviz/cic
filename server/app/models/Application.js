const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const applicationSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User' },
  name: String,
  description: String,
  redirectURL: String,
  read: Boolean,
  write: Boolean,
});

const Application = mongoose.model('Application', applicationSchema);

module.exports = Application;
