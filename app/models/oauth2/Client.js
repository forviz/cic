const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const uid = require('uid2');

const ClientSchema = new Schema({
  name: { type: String, unique: true, required: true },
  id: { type: String, unique: true, default: () => uid(20) },
  oauth_secret: { type: String, unique: true, default: () => uid(42) },
  domains: [{ type: String }],
  userId: { type: String },
});

const Client = mongoose.model('Client', ClientSchema);

module.exports = Client;
