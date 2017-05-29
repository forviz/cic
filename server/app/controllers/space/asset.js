const mongoose = require('mongoose');
const _ = require('lodash');

const Asset = require('../../models/Asset');
const Space = require('../../models/Space');

const _helper = require('./helper');

/**
 * Assets
 */
exports.getAllAssets = (req, res, next) => {
  const spaceId = req.params.space_id;
   Space.findOne({ _id: spaceId }).populate('assets').exec((err, space) => {
    if (err) next(err);
    res.json({
      items: space.assets,
    });
  });
};

exports.getSingleAsset = (req, res, next) => {
  const assetId = req.params.asset_id;
  Asset.findOne({ _id: assetId }, (err, asset) => {
    if (err) next(err);
    res.json({
      item: asset,
    });
  });
};

// UPDATE ASSET
const updateAsset = async (req, res, next) => {
  const spaceId = req.params.space_id;
  const assetId = req.params.asset_id;
  const fields = req.body.fields;

  try {
    const space = await Space.findOne({ _id: spaceId });
    const asset = await Asset.findOneAndUpdate({ _id: assetId }, {
      fields,
      _spaceId: spaceId,
    }, {
      new: true,
      upsert: true,
    });

    // Add to space.entires if not exists
    space.assets = _.uniq([...space.assets, asset._id]);
    await space.save();

    res.json({
      status: 'SUCCESS',
      detail: 'Create new asset successfully',
      asset,
    });
  } catch (e) {
    next(e);
  }
};

exports.updateAsset = updateAsset;

// CREATE CONTENT TYPE
exports.createAsset = (req, res, next) => {
  // Create new objectId
  const assetId = mongoose.Types.ObjectId();
  req.params.asset_id = assetId;
  return updateAsset(req, res, next);
};

exports.deleteAsset = async (req, res, next) => {
  const spaceId = req.params.space_id;
  const assetId = req.params.asset_id;

  try {
    await Asset.remove({ _id: assetId });
    const space = await Space.findOne({ _id: spaceId });
    space.assets = _.filter(space.assets, _id => !_id.equals(assetId));
    await space.save();

    res.json({
      status: 'SUCCESS',
      detail: 'delete asset successfully',
    });
  } catch (e) {
    next(e);
  }
};

exports.truncateAsset = (req, res, next) => {
  const spaceId = req.params.space_id;
  Space.findOne({ _id: spaceId }, (err, space) => {
    if (err) next(err);
    space.assets.clear();
    space.save((errSave) => {
      if (errSave) _helper.handleError(errSave, next);

      Asset.remove({ _spaceId: spaceId }, (err2) => {
        if (err2) _helper.handleError(err2, next);
        res.json({
          status: 'SUCCESS',
          detail: 'clear all assets in space successfully',
          space,
        });
      });
    });
  });
};
