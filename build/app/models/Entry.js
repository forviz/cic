'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var entrySchema = new Schema({
  // contentType: String,
  contentTypeId: Schema.Types.ObjectId,
  _spaceId: Schema.Types.ObjectId,
  fields: Object,
  status: {
    type: String,
    default: 'draft',
    enum: ['draft', 'publish', 'archive']
  },
  createdAt: { type: 'Date', default: Date.now, required: true },
  updatedAt: { type: 'Date', default: Date.now, required: true },
  publishedAt: 'Date',
  publishedBy: String,
  publishedVersion: Number
});

var Entry = mongoose.model('Entry', entrySchema);

module.exports = Entry;
//# sourceMappingURL=Entry.js.map