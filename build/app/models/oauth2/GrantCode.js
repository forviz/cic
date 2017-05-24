'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var CodeSchema = new Schema({
  value: { type: String, required: true },
  redirectUri: { type: String, required: true },
  userId: { type: String, required: true },
  clientId: { type: String, required: true },
  active: { type: Boolean, default: true }
});

var Code = mongoose.model('Code', CodeSchema);

module.exports = Code;
//# sourceMappingURL=GrantCode.js.map