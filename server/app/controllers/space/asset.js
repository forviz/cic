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
    if (err) { return next(err); }
    res.json({
      items: space.assets,
    });
  });
};

exports.getSingleAsset = (req, res, next) => {
  const assetId = req.params.asset_id;
  Asset.findOne({ _id: assetId }, (err, asset) => {
    if (err) { return next(err); }
    res.json({
      item: asset,
    });
  });
};

// UPDATE CONTENT TYPE
const updateAsset = (req, res, next) => {
  const spaceId = req.params.space_id;
  const assetId = req.params.asset_id;
  const fields = req.body.fields;
  console.log('updateAsset', spaceId, assetId, fields);

  Space.findOne({ _id: spaceId }, (err, space) => {
    if (err) { return next(err); }


    const isExistingInSpace = _.find(space.assets, (asset) => {
      console.log('asset', asset, assetId, asset.equals(assetId));
      return asset.equals(assetId);
    });
    console.log('isExistingInSpace', isExistingInSpace);
    if (isExistingInSpace) {
      // Update asset
      Asset.findOne({ _id: assetId }, (err, asset) => {
        asset.fields = fields;
        console.log('updateExistingAsset', asset);
        asset.save((err1) => {
          if (err1) {
            console.log(err1);
            return _helper.handleError(err1, next);
          }
          res.json({
            status: 'SUCCESS',
            detail: 'Updating asset successfully',
            asset,
          });
        });
      });
    } else {
      // 1. Create and Insert new asset
      // 2. Update spaces.asset
      const newAsset = new Asset({
        fields,
        status: 'draft',
        _spaceId: spaceId,
      });
      console.log('newAsset', newAsset);

      newAsset.save((errorSaveAsset) => {
        if (errorSaveAsset) return _helper.handleError(errorSaveAsset, next);

        // Update space
        space.assets.push(newAsset._id);
        space.save((err2) => {
          if (err2) { return next(err2); }
          res.json({
            status: 'SUCCESS',
            detail: 'Create new asset successfully',
            asset: newAsset,
          });
        });
      });
    }
  });
};

exports.updateAsset = updateAsset;

// CREATE CONTENT TYPE
exports.createAsset = (req, res, next) => {
  // Create new objectId
  const assetId = mongoose.Types.ObjectId();
  req.params.asset_id = assetId;
  return updateAsset(req, res, next);
};

exports.deleteAsset = (req, res, next) => {
  const spaceId = req.params.space_id;
  const assetId = req.params.asset_id;
  Asset.remove({ _id: assetId }, (err) => {
    if (err) return _helper.handleError(err, next);

    // Remove asset ref from space
    Space.findOne({ _id: spaceId }, (err, space) => {
      if (err) return _helper.handleError(err, next);
      space.assets = _.filter(space.assets, _id => !_id.equals(assetId));

      space.save((err2) => {
        if (err2) return _helper.handleError(err2, next);
        res.json({
          status: 'SUCCESS',
          detail: 'delete asset successfully',
        });
      });
    });
  });
};

exports.truncateAsset = (req, res, next) => {
  const spaceId = req.params.space_id;
  Space.findOne({ _id: spaceId }, (err, space) => {
    if (err) { return next(err); }
    space.assets = [];
    space.save((err) => {
      if (err) return _helper.handleError(err, next);

      Asset.remove({ _spaceId: spaceId }, (err2) => {
        if (err2) return _helper.handleError(err2, next);
        res.json({
          status: 'SUCCESS',
          detail: 'clear all assets in space successfully',
          space,
        });
      });
    });
  });
};
