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
const updateContentType = async (req, res, next) => {
  const spaceId = req.params.space_id;
  const contentTypeId = req.params.content_type_id;
  const name = req.body.name;
  const displayField = req.body.displayField;
  const identifier = req.body.identifier;
  const fields = req.body.fields;

  try {
    const space = await Space.findOne({ _id: spaceId });

    const contentTypeToUpdate = {
      _id: contentTypeId,
      name,
      identifier,
      displayField,
      fields: _.map(fields, (fld) => {
        if (fld._id === '') return { ...fld, _id: mongoose.Types.ObjectId() };
        return fld;
      }),
      dateUpdated: Date.now(),
    };

    const index = _.findIndex(space.contentTypes, ct => ct._id.equals(contentTypeId));

    if (index > -1) {
      // Existing
      space.contentTypes[index] = contentTypeToUpdate;
    } else {
      // New
      space.contentTypes.push(contentTypeToUpdate);
    }

    await space.save();

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
  } catch (e) {
    next(e);
  }
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
exports.deleteContentType = async (req, res, next) => {
  const spaceId = req.params.space_id;
  const contentTypeId = req.params.content_type_id;

  try {
    const space = await Space.findOne({ _id: spaceId });
    space.contentTypes = _.filter(space.contentTypes, ct => !ct._id.equals(contentTypeId));
    await space.save();

    res.json({
      status: 'SUCCESSFUL',
      message: 'Delete contentType successfully',
    });
  } catch (e) {
    next(e);
  }
};
