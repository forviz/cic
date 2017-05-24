'use strict';

var mongoose = require('mongoose');
var _ = require('lodash');

var Space = require('../../models/Space');

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

exports.getSingleContentType = function (req, res, next) {};

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

exports.getSingleContentType = function (req, res, next) {
  var spaceId = req.params.space_id;
  var contentTypeId = req.params.content_type_id;
  Space.findOne({ _id: spaceId }, function (err, space) {
    if (err) {
      return next(err);
    }

    var contentType = _.find(space.contentTypes, function (ct) {
      return ct._id.equals(contentTypeId);
    });
    if (contentType) {
      res.json({
        type: contentType
      });
    }
  });
};

// UPDATE CONTENT TYPE
var updateContentType = function updateContentType(req, res, next) {
  var spaceId = req.params.space_id;
  var contentTypeId = req.params.content_type_id;
  var name = req.body.name;
  var displayField = req.body.displayField;
  var identifier = req.body.identifier;
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
            identifier: identifier,
            displayField: displayField,
            fields: _.map(fields, function (field) {
              return {
                id: field.id,
                name: field.name,
                identifier: field.identifier,
                type: field.type,
                required: field.required,
                localized: field.localized,
                validations: field.validations
              };
            }),
            dateUpdated: Date.now()
          };
        }
        return contentType;
      });
    } else {
      // Add New
      space.contentTypes.push({
        _id: contentTypeId,
        name: name,
        identifier: identifier,
        displayField: displayField,
        fields: _.map(fields, function (field) {
          return {
            id: field.id,
            name: field.name,
            identifier: field.identifier,
            type: field.type,
            required: field.required,
            localized: field.localized,
            validations: field.validations
          };
        }),
        dateUpdated: Date.now()
      });
    }

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
//# sourceMappingURL=contentType.js.map