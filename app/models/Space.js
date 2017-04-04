const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const spaceSchema = new mongoose.Schema({
  name: String,
  defaultLocale: { type: String, default: 'en', required: true },
  apiKeys: [{
    _id: Schema.Types.ObjectId,
    name: String,
    description: String,
    deliveryKey: String,
    previewKey: String,
  }],
  contentTypes: [{
    _id: Schema.Types.ObjectId,
    name: String,
    identifier: String,
    description: String,
    fields: [{
      id: String,
      name: String,
      identifier: String,
      fieldType: String,
      required: Boolean,
      localized: Boolean,
      validations: {
        linkContentType: [String], // Link to another contentType
        in: [String], // Takes an array of values and validates that the field value is in this array.
        linkMimetypeGroup: String, // Takes a MIME type group name and validates that the link points to an asset of this group
        size: { // Takes optional min and max parameters and validates the size of the array (number of objects in it).
          min: Number,
          max: Number,
        },
        range: {
          min: Number,
          max: Number,
        },
        regexp: {
          pattern: String,
          flags: String,
        },
        unique: Boolean,
      }
    }]
  }],
  entries: [{ type: Schema.Types.ObjectId, ref: 'Entry' }],
  // entries: [{
  //   contentType: String,
  //   fields: Object,
  //   publishedAt: 'Date',
  //   publishedBy: String,
  //   publishedVersion: Number,
  // }],
  createdAt: { type: 'Date', default: Date.now, required: true },
  updatedAt: { type: 'Date', default: Date.now, required: true },
}, { timestamps: true });


const Space = mongoose.model('Space', spaceSchema);

module.exports = Space;
