const mongoose = require('mongoose');
const _ = require('lodash');

const Space = require('../../models/Space');

/**
 * Get
 */
exports.getAll = (req, res, next) => {
  Space.find({}, (err, spaces) => {
    if (err) { return next(err); }
    res.json({
      items: spaces,
    });
  });
};

exports.getSingle = (req, res, next) => {
  const spaceId = req.params.space_id;
  Space.find({ _id: spaceId }).exec((err, spaces) => {
    if (err) { return next(err); }
    res.json({
      spaces,
    });
  });
}

exports.updateSpace = (req, res, next) => {

}

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
