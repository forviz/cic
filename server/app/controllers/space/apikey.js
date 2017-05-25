import _ from 'lodash';

const cuid = require('cuid');
const mongoose = require('mongoose');
const Space = require('../../models/Space');

exports.getAllKey = async (req, res, next) => {
  const spaceId = req.params.space_id;
  try {
    const space = await Space.findOne({ _id: spaceId });
    res.json({
      title: 'Keys',
      items: space.apiKeys,
    });
  } catch (e) {
    next(e);
  }
};

exports.clearAllKey = async (req, res, next) => {
  const spaceId = req.params.space_id;
  try {
    const space = Space.findOne({ _id: spaceId });
    space.apiKeys = [];
    await space.save();
    res.json({
      title: 'Cleared key',
      space,
    });
  } catch (e) {
    next(e);
  }
};

exports.updateKey = async (req, res, next) => {
  const spaceId = req.params.space_id;
  const keyId = req.params.key_id;
  const { name } = req.body;

  try {
    const space = await Space.findOne({ _id: spaceId });
    const isExisting = _.find(space.apiKeys, k => k._id.equals(keyId));

    if (isExisting) {
      // TODO:
      // Update existing noe
      space.apiKeys = _.map(space.apiKeys, (apiKey) => {
        if (apiKey._id.equals(keyId)) {
          return {
            _id: apiKey._id,
            name,
          };
        }
        return apiKey;
      });

      await space.save();
      res.json({
        title: 'Updated key',
        space,
      });
    }
  } catch (e) {
    next(e);
  }
  /*
  Space.findOne({ _id: spaceId }, (err, space) => {
    if (err) { return next(err); }

    const isExisting = _.find(space.apiKeys, k => k._id.equals(keyId));

    if (isExisting) {
      // TODO:
      // Update existing noe
      space.apiKeys = _.map(space.apiKeys, (apiKey) => {

        if (apiKey._id.equals(keyId)) {
          return {
            _id: apiKey._id,
            name,
          };
        }
        return apiKey;
      });

      space.save(err => {
        if (err) next(err);
        res.json({
          title: 'Updated key',
          space,
        });
      })
    }
  });
  */
};

exports.createKey = (req, res, next) => {
  const spaceId = req.params.space_id;

  const { name } = req.body;
  const objectId = mongoose.Types.ObjectId();
  const deliveryKey = cuid();
  const previewKey = cuid();
  const expireDate = req.body.expire_date;

  Space.findOne({ _id: spaceId }, (err, space) => {
    if (err) next(err);

    const key = {
      _id: objectId,
      name: name || space.name,
      deliveryKey,
      previewKey,
      expireDate,
    };

    space.apiKeys.push(key);

    space.save((err2) => {
      if (err2) next(err2);
      res.json({
        title: 'Added key',
        item: key,
        space,
      });
    });
  });
};


// DELETE KEY
exports.deleteKey = (req, res, next) => {
  const spaceId = req.params.space_id;
  const keyId = req.params.key_id;

  Space.findOne({ _id: spaceId }, (err, space) => {
    if (err) next(err);

    if (!space) {
      res.json({
        status: 'UNSUCCESSFUL',
        message: 'Cannot find space',
      });
    } else {
      space.apiKeys = _.filter(space.apiKeys, apiKey => !apiKey._id.equals(keyId));
      space.save((err2) => {
        if (err2) next(err2);
        res.json({
          status: 'SUCCESSFUL',
          message: 'Delete apiKey successfully',
        });
      });
    }
  });
};
