'use strict';

var mongoose = require('mongoose');
var _ = require('lodash');

var Asset = require('../../models/Asset');
var Space = require('../../models/Space');

var _helper = require('./helper');

/**
 * Assets
 */
exports.getAllAssets = function (req, res, next) {
  var spaceId = req.params.space_id;
  Space.findOne({ _id: spaceId }).populate('assets').exec(function (err, space) {
    if (err) {
      return next(err);
    }
    res.json({
      items: space.assets
    });
  });
};

exports.getSingleAsset = function (req, res, next) {
  var assetId = req.params.asset_id;
  Asset.findOne({ _id: assetId }, function (err, asset) {
    if (err) {
      return next(err);
    }
    res.json({
      item: asset
    });
  });
};

// UPDATE CONTENT TYPE
var updateAsset = function updateAsset(req, res, next) {
  var spaceId = req.params.space_id;
  var assetId = req.params.asset_id;
  var fields = req.body.fields;
  console.log('updateAsset', spaceId, assetId, fields);

  Space.findOne({ _id: spaceId }, function (err, space) {
    if (err) {
      return next(err);
    }

    var isExistingInSpace = _.find(space.assets, function (asset) {
      console.log('asset', asset, assetId, asset.equals(assetId));
      return asset.equals(assetId);
    });
    console.log('isExistingInSpace', isExistingInSpace);
    if (isExistingInSpace) {

      // Update asset
      Asset.findOne({ _id: assetId }, function (err, asset) {
        asset.fields = fields;
        console.log('updateExistingAsset', asset);
        asset.save(function (err1) {
          if (err1) {
            console.log(err1);
            return _helper.handleError(err1, next);
          }
          res.json({
            status: 'SUCCESS',
            detail: 'Updating asset successfully',
            asset: asset
          });
        });
      });
    } else {
      // 1. Create and Insert new asset
      // 2. Update spaces.asset
      var newAsset = new Asset({
        fields: fields,
        status: 'draft',
        _spaceId: spaceId
      });
      console.log('newAsset', newAsset);

      newAsset.save(function (errorSaveAsset) {
        if (errorSaveAsset) return _helper.handleError(errorSaveAsset, next);

        // Update space
        space.assets.push(newAsset._id);
        space.save(function (err2) {
          if (err2) {
            return next(err2);
          }
          res.json({
            status: 'SUCCESS',
            detail: 'Create new asset successfully',
            asset: newAsset
          });
        });
      });
    }
  });
};

exports.updateAsset = updateAsset;

// CREATE CONTENT TYPE
exports.createAsset = function (req, res, next) {
  // Create new objectId
  var assetId = mongoose.Types.ObjectId();
  req.params.asset_id = assetId;
  return updateAsset(req, res, next);
};

exports.deleteAsset = function (req, res, next) {
  var spaceId = req.params.space_id;
  var assetId = req.params.asset_id;
  Asset.remove({ _id: assetId }, function (err) {
    if (err) return _helper.handleError(err, next);

    // Remove asset ref from space
    Space.findOne({ _id: spaceId }, function (err, space) {
      if (err) return _helper.handleError(err, next);
      space.assets = _.filter(space.assets, function (_id) {
        return !_id.equals(assetId);
      });

      space.save(function (err2) {
        if (err2) return _helper.handleError(err2, next);
        res.json({
          status: 'SUCCESS',
          detail: 'delete asset successfully'
        });
      });
    });
  });
};

exports.truncateAsset = function (req, res, next) {
  var spaceId = req.params.space_id;
  Space.findOne({ _id: spaceId }, function (err, space) {
    if (err) {
      return next(err);
    }
    space.assets = [];
    space.save(function (err) {
      if (err) return _helper.handleError(err, next);

      Asset.remove({ _spaceId: spaceId }, function (err2) {
        if (err2) return _helper.handleError(err2, next);
        res.json({
          status: 'SUCCESS',
          detail: 'clear all assets in space successfully',
          space: space
        });
      });
    });
  });
};
//# sourceMappingURL=asset.js.map