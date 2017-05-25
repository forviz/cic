const mongoose = require('mongoose');
const _ = require('lodash');

const Space = require('../../models/Space');

exports.getAllContentTypes = (req, res, next) => {
  const spaceId = req.params.space_id;
  Space.findOne({ _id: spaceId }, (err, theSpace) => {
    if (err) next(err);
    res.json({
      types: theSpace.contentTypes,
    });
  });
};

/**
 * Content Types
 */
exports.getAllContentTypes = (req, res, next) => {
  const spaceId = req.params.space_id;
  Space.findOne({ _id: spaceId }, (err, theSpace) => {
    if (err) next(err);
    res.json({
      types: theSpace.contentTypes,
    });
  });
};

exports.getSingleContentType = (req, res, next) => {
  const spaceId = req.params.space_id;
  const contentTypeId = req.params.content_type_id;
  Space.findOne({ _id: spaceId }, (err, space) => {
    if (err) next(err);

    const contentType = _.find(space.contentTypes, ct => ct._id.equals(contentTypeId));
    if (contentType) {
      res.json({
        type: contentType,
      });
    }
  });
};

// UPDATE CONTENT TYPE
const updateContentType = (req, res, next) => {
  const spaceId = req.params.space_id;
  const contentTypeId = req.params.content_type_id;
  const name = req.body.name;
  const displayField = req.body.displayField;
  const identifier = req.body.identifier;
  const fields = req.body.fields;
  
  Space.findOne({ _id: spaceId }, (err, space) => {
    if (err) next(err);

    const isExisting = _.find(space.contentTypes, ct => ct._id.equals(contentTypeId));

    if (isExisting) {
      // Update existing noe
      space.contentTypes = _.map(space.contentTypes, (contentType) => {
        if (contentType._id.equals(contentTypeId)) {
          return {
            _id: contentType._id,
            name,
            identifier,
            displayField,
            fields: _.map(fields, field => ({
              id: field.id,
              name: field.name,
              identifier: field.identifier,
              type: field.type,
              required: field.required,
              localized: field.localized,
              validations: field.validations,
            })),
            dateUpdated: Date.now(),
          };
        }
        return contentType;
      });
    } else {
      // Add New
      space.contentTypes.push({
        _id: contentTypeId,
        name,
        identifier,
        displayField,
        fields: _.map(fields, field => ({
          id: field.id,
          name: field.name,
          identifier: field.identifier,
          type: field.type,
          required: field.required,
          localized: field.localized,
          validations: field.validations,
        })),
        dateUpdated: Date.now(),
      });
    }


    space.save((errSave) => {
      if (errSave) next(errSave);
      res.json({
        status: 'SUCCESS',
        detail: 'update content type successfully',
        sys: {
          type: 'ContentType',
          id: contentTypeId,
          updatedAt: Date.now(),
        },
        space,
      });
    });
  });
};

exports.updateContentType = updateContentType;

// CREATE CONTENT TYPE
exports.createContentType = (req, res, next) => {
  // Create new objectId
  const contentTypeId = mongoose.Types.ObjectId();
  req.params.content_type_id = contentTypeId;
  return updateContentType(req, res, next);
};


// DELETE CONTENT TYPE
exports.deleteContentType = (req, res, next) => {
  const spaceId = req.params.space_id;
  const contentTypeId = req.params.content_type_id;

  Space.findOne({ _id: spaceId }, (err, space) => {
    if (err) next(err);

    if (!space) {
      res.json({
        status: 'UNSUCCESSFUL',
        message: 'Cannot find space',
      });
    } else {
      const contentTypes = space.contentTypes;
      space.contentTypes = _.filter(contentTypes, ct => !ct._id.equals(contentTypeId));

      space.save((errSave) => {
        if (errSave) next(errSave);
        res.json({
          status: 'SUCCESSFUL',
          message: 'Delete contentType successfully',
        });
      });
    }
  });
};
