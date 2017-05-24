'use strict';

var Space = require('../../models/Space');
var mongoose = require('mongoose');
var _ = require('lodash');

exports.getAll = function (req, res) {

  Space.find({}, function (err, theSpaces) {
    res.json({
      title: 'Spaces',
      items: theSpaces
    });
  });
};

var getSingle = function getSingle(req, res, next) {

  var spaceId = req.params.space_id;
  var accessToken = req.query.access_token;

  Space.findOne({ _id: spaceId }, function (err, space) {
    if (err) {
      console.log(err);return next(err);
    }

    var apiKeys = space.apiKeys;

    // Check Key
    var isContentDelivery = _.some(apiKeys, function (keyItem) {
      return keyItem.deliveryKey === accessToken;
    });
    var isContentPreview = _.some(apiKeys, function (keyItem) {
      return keyItem.previewKey === accessToken;
    });

    if (isContentDelivery) {
      // Content Delivery
      res.json({
        title: 'find space',
        space: space
      });
    } else if (isContentPreview) {
      // Content Preview
      res.json({
        title: 'find space',
        space: space
      });
    } else {
      // Invalid key
      res.json({
        status: 'UNSUCESSFUL',
        title: 'Invalid key space'
      });
    }
  });
};

exports.getSingle = getSingle;

exports.createSpace = function (req, res, next) {
  var spaceName = req.body.name;
  var defaultLocale = req.body.defaultLocale;

  var space = new Space({
    name: spaceName,
    defaultLocale: defaultLocale
  });

  space.save(function (err) {
    if (err) {
      return next(err);
    }
    res.json({
      status: 'SUCCESS',
      detail: 'Create space successfully'
    });
  });
};

exports.deleteSpace = function (req, res, next) {
  var spaceId = req.params.space_id;
  Space.findOne({ _id: spaceId }, function (err, space) {
    if (err) {
      return next(err);
    }

    if (!space) {
      res.json({
        status: 'UNSUCCESSFUL',
        message: 'Cannot find space'
      });
    } else {
      space.remove();
      res.json({
        status: 'SUCCESSFUL',
        message: 'Delete successfully'
      });
    }
  });
};

/**
 * Content Types
 */
exports.getAllContentTypes = function (req, res, next) {
  var spaceId = req.params.space_id;
  Space.findOne({ _id: spaceId }, function (err, theSpace) {
    if (err) {
      return next(err);
    }
    res.json({
      types: theSpace.contentTypes
    });
  });
};

exports.getSingleContentType = function (req, res) {};

// UPDATE CONTENT TYPE
var updateContentType = function updateContentType(req, res, next) {
  var spaceId = req.params.space_id;
  var contentTypeId = req.params.content_type_id;
  var name = req.body.name;
  var fields = req.body.fields;

  Space.findOne({ _id: spaceId }, function (err, space) {
    if (err) {
      return next(err);
    }

    var isExisting = _.find(space.contentTypes, function (ct) {
      return ct._id.equals(contentTypeId);
    });

    if (isExisting) {
      // Update existing noe
      space.contentTypes = _.map(space.contentTypes, function (contentType) {

        if (contentType._id.equals(contentTypeId)) {
          return {
            _id: contentType._id,
            name: name,
            fields: _.map(fields, function (field) {
              return {
                id: field.id,
                name: field.name,
                fieldType: field.type,
                required: field.required,
                localized: field.localized,
                validations: field.validations
              };
            })
          };
        }
        return contentType;
      });
    } else {
      // Add New
      space.contentTypes.push({
        _id: contentTypeId,
        name: name,
        fields: _.map(fields, function (field) {
          return {
            id: field.id,
            name: field.name,
            fieldType: field.type,
            required: field.required,
            localized: field.localized,
            validations: field.validations
          };
        })
      });
    }

    space.dateUpdated = Date.now();

    space.save(function (err) {
      if (err) {
        console.log(err);return next(err);
      }
      res.json({
        status: 'SUCCESS',
        detail: 'update content type successfully',
        space: space
      });
    });
  });
};

exports.updateContentType = updateContentType;

// CREATE CONTENT TYPE
exports.createContentType = function (req, res, next) {

  // Create new objectId
  var contentTypeId = mongoose.Types.ObjectId();
  req.params.content_type_id = contentTypeId;
  return updateContentType(req, res, next);
};

// DELETE CONTENT TYPE
exports.deleteContentType = function (req, res, next) {
  var spaceId = req.params.space_id;
  var contentTypeId = req.params.content_type_id;

  Space.findOne({ _id: spaceId }, function (err, space) {
    if (err) {
      return next(err);
    }

    if (!space) {
      res.json({
        status: 'UNSUCCESSFUL',
        message: 'Cannot find space'
      });
    } else {
      var contentTypes = space.contentTypes;
      space.contentTypes = _.filter(contentTypes, function (ct) {
        return !ct._id.equals(contentTypeId);
      });

      space.save(function (err) {
        if (err) {
          return next(err);
        }
        res.json({
          status: 'SUCCESSFUL',
          message: 'Delete contentType successfully'
        });
      });
    }
  });
};
//# sourceMappingURL=index-old.js.map