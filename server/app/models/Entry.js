const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const entrySchema = new Schema({
  contentType: String,
  _spaceId: Schema.Types.ObjectId,
  fields: Object,
  status: {
    type: String,
    default: 'draft',
    enum: ['draft', 'published']
  },
  publishedAt: 'Date',
  publishedBy: String,
  publishedVersion: Number,
});

const Entry = mongoose.model('Entry', entrySchema);

module.exports = Entry;
