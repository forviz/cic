const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const applicationSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  token: String,
  name: String,
  read: Boolean,
  write: Boolean,
  createdAt: { type: 'Date', default: Date.now, required: true },
  updatedAt: { type: 'Date', default: Date.now, required: true },
});

applicationSchema.pre('save', function save(next) {
  // const application = this;
  // user.token = hash;
  next();
});

const Application = mongoose.model('Application', applicationSchema);

module.exports = Application;
