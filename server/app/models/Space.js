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
    expireDate: { type: 'Date', default: +new Date() + 5*365*24*60*60*1000 },
    active: { type: Boolean, default: true },
  }],
  contentTypes: [{
    _id: Schema.Types.ObjectId,
    name: String,
    identifier: String,
    description: String,
    displayField: { type: String, default: 'title' },
    fields: [{
      id: String,
      name: String,
      identifier: String,
      fieldType: String,
      required: Boolean,
      localized: Boolean,
      type: { type: String, default: 'Text' },
      validations: {
        linkContentType: [String], // Link to another contentType
        // Takes an array of values and validates that the field
        //  value is in this array.
        in: [String],
        // Takes a MIME type group name and validates that
        // the link points to an asset of this group
        linkMimetypeGroup: String,
        // Takes optional min and max parameters and validates
        // the size of the array (number of objects in it).
        size: {
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
      },
    }],
  }],
  entries: [{ type: Schema.Types.ObjectId, ref: 'Entry' }],
  assets: [{ type: Schema.Types.ObjectId, ref: 'Asset' }],
  createdAt: { type: 'Date', default: Date.now, required: true },
  updatedAt: { type: 'Date', default: Date.now, required: true },
}, { timestamps: true });


const Space = mongoose.model('Space', spaceSchema);

module.exports = Space;
