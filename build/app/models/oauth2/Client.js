'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var uid = require('uid2');

var ClientSchema = new Schema({
  name: { type: String, unique: true, required: true },
  id: { type: String, unique: true, default: function _default() {
      return uid(20);
    } },
  oauth_secret: { type: String, unique: true, default: function _default() {
      return uid(42);
    } },
  domains: [{ type: String }],
  userId: { type: String }
});

var Client = mongoose.model('Client', ClientSchema);

module.exports = Client;
//# sourceMappingURL=Client.js.map