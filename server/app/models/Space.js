const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const spaceSchema = new Schema({
  name: String,
  defaultLocale: { type: String, default: 'en', required: true },
  locales: [{
    code: String,
    default: Boolean,
    name: String,
    fallbackCode: String,
  }],
  // users: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  organization: { type: Schema.Types.ObjectId, ref: 'Organization' },
  apiKeys: [{
    _id: Schema.Types.ObjectId,
    name: String,
    description: String,
    deliveryKey: String,
    previewKey: String,
    expireDate: { type: 'Date', default: +new Date() + (5 * 365 * 24 * 60 * 60 * 1000) },
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
      required: Boolean,
      localized: Boolean,
      type: { type: String, default: 'Text' },
      items: Object,
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
      appearance: String,
      helpText: String,
    }],
  }],
  entries: [{ type: Schema.Types.ObjectId, ref: 'Entry' }],
  assets: [{ type: Schema.Types.ObjectId, ref: 'Asset' }],
  createdAt: { type: 'Date', default: Date.now, required: true },
  updatedAt: { type: 'Date', default: Date.now, required: true },
}, { timestamps: true });

spaceSchema.methods.sys = function sys() {
  return {
    type: 'Space',
    id: this._id,
  };
};

const Space = mongoose.model('Space', spaceSchema);

module.exports = Space;
