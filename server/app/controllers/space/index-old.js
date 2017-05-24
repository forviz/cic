const Space = require('../../models/Space');
const mongoose = require('mongoose');
const _ = require('lodash');

exports.getAll = (req, res) => {

  Space.find({ }, (err, theSpaces) => {
    res.json({
      title: 'Spaces',
      items: theSpaces,
    });
  });
};

const getSingle = (req, res, next) => {


  const spaceId = req.params.space_id;
  const accessToken = req.query.access_token;

  Space.findOne({ _id: spaceId }, (err, space) => {
    if (err) { console.log(err); return next(err); }

    const apiKeys = space.apiKeys;

    // Check Key
    const isContentDelivery = _.some(apiKeys, keyItem => keyItem.deliveryKey === accessToken);
    const isContentPreview = _.some(apiKeys, keyItem => keyItem.previewKey === accessToken);

    if (isContentDelivery) {
      // Content Delivery
      res.json({
        title: 'find space',
        space,
      });
    } else if (isContentPreview) {
      // Content Preview
      res.json({
        title: 'find space',
        space,
      });
    } else {
      // Invalid key
      res.json({
        status: 'UNSUCESSFUL',
        title: 'Invalid key space',
      });
    }
  });
};

exports.getSingle = getSingle;

exports.createSpace = (req, res, next) => {
  const spaceName = req.body.name;
  const defaultLocale = req.body.defaultLocale;

  const space = new Space({
    name: spaceName,
    defaultLocale,
  });

  space.save((err) => {
    if (err) { return next(err); }
    res.json({
      status: 'SUCCESS',
      detail: 'Create space successfully',
    });
  });
};

exports.deleteSpace = (req, res, next) => {
  const spaceId = req.params.space_id;
  Space.findOne({ _id: spaceId }, (err, space) => {
    if (err) { return next(err); }

    if (!space) {
      res.json({
        status: 'UNSUCCESSFUL',
        message: 'Cannot find space',
      });
    } else {
      space.remove();
      res.json({
        status: 'SUCCESSFUL',
        message: 'Delete successfully',
      });
    }
  });
};

/**
 * Content Types
 */
exports.getAllContentTypes = (req, res, next) => {
  const spaceId = req.params.space_id;
  Space.findOne({ _id: spaceId }, (err, theSpace) => {
    if (err) { return next(err); }
    res.json({
      types: theSpace.contentTypes,
    });
  });
};

exports.getSingleContentType = (req, res) => {

};

// UPDATE CONTENT TYPE
const updateContentType = (req, res, next) => {
  const spaceId = req.params.space_id;
  const contentTypeId = req.params.content_type_id;
  const name = req.body.name;
  const fields = req.body.fields;

  Space.findOne({ _id: spaceId }, (err, space) => {
    if (err) { return next(err); }

    const isExisting = _.find(space.contentTypes, ct => ct._id.equals(contentTypeId));

    if (isExisting) {
      // Update existing noe
      space.contentTypes = _.map(space.contentTypes, (contentType) => {

        if (contentType._id.equals(contentTypeId)) {
          return {
            _id: contentType._id,
            name,
            fields: _.map(fields, field => ({
              id: field.id,
              name: field.name,
              fieldType: field.type,
              required: field.required,
              localized: field.localized,
              validations: field.validations,
            })),
          };
        }
        return contentType;
      });
    } else {
      // Add New
      space.contentTypes.push({
        _id: contentTypeId,
        name,
        fields: _.map(fields, field => ({
          id: field.id,
          name: field.name,
          fieldType: field.type,
          required: field.required,
          localized: field.localized,
          validations: field.validations,
        })),
      });
    }

    space.dateUpdated = Date.now();

    space.save((err) => {
      if (err) { console.log(err); return next(err); }
      res.json({
        status: 'SUCCESS',
        detail: 'update content type successfully',
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
    if (err) { return next(err); }

    if (!space) {
      res.json({
        status: 'UNSUCCESSFUL',
        message: 'Cannot find space',
      });
    } else {
      const contentTypes = space.contentTypes;
      space.contentTypes = _.filter(contentTypes, ct => !ct._id.equals(contentTypeId));

      space.save((err) => {
        if (err) { return next(err); }
        res.json({
          status: 'SUCCESSFUL',
          message: 'Delete contentType successfully',
        });
      });
    }
  });
};
