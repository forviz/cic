'use strict';

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

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
    if (err) next(err);
    res.json({
      items: space.assets
    });
  });
};

exports.getSingleAsset = function (req, res, next) {
  var assetId = req.params.asset_id;
  Asset.findOne({ _id: assetId }, function (err, asset) {
    if (err) next(err);
    res.json({
      item: asset
    });
  });
};

// UPDATE ASSET
var updateAsset = function () {
  var _ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee(req, res, next) {
    var spaceId, assetId, fields, space, asset;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            spaceId = req.params.space_id;
            assetId = req.params.asset_id;
            fields = req.body.fields;
            _context.prev = 3;
            _context.next = 6;
            return Space.findOne({ _id: spaceId });

          case 6:
            space = _context.sent;
            _context.next = 9;
            return Asset.findOneAndUpdate({ _id: assetId }, {
              fields: fields,
              _spaceId: spaceId
            }, {
              new: true,
              upsert: true
            });

          case 9:
            asset = _context.sent;


            // Add to space.entires if not exists
            space.assets = _.uniq([].concat(_toConsumableArray(space.assets), [asset._id]));
            _context.next = 13;
            return space.save();

          case 13:

            res.json({
              status: 'SUCCESS',
              detail: 'Create new asset successfully',
              asset: asset
            });
            _context.next = 19;
            break;

          case 16:
            _context.prev = 16;
            _context.t0 = _context['catch'](3);

            next(_context.t0);

          case 19:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, undefined, [[3, 16]]);
  }));

  return function updateAsset(_x, _x2, _x3) {
    return _ref.apply(this, arguments);
  };
}();

exports.updateAsset = updateAsset;

// CREATE CONTENT TYPE
exports.createAsset = function (req, res, next) {
  // Create new objectId
  var assetId = mongoose.Types.ObjectId();
  req.params.asset_id = assetId;
  return updateAsset(req, res, next);
};

exports.deleteAsset = function () {
  var _ref2 = _asyncToGenerator(regeneratorRuntime.mark(function _callee2(req, res, next) {
    var spaceId, assetId, space;
    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            spaceId = req.params.space_id;
            assetId = req.params.asset_id;
            _context2.prev = 2;
            _context2.next = 5;
            return Asset.remove({ _id: assetId });

          case 5:
            _context2.next = 7;
            return Space.findOne({ _id: spaceId });

          case 7:
            space = _context2.sent;

            space.assets = _.filter(space.assets, function (_id) {
              return !_id.equals(assetId);
            });
            _context2.next = 11;
            return space.save();

          case 11:

            res.json({
              status: 'SUCCESS',
              detail: 'delete asset successfully'
            });
            _context2.next = 17;
            break;

          case 14:
            _context2.prev = 14;
            _context2.t0 = _context2['catch'](2);

            next(_context2.t0);

          case 17:
          case 'end':
            return _context2.stop();
        }
      }
    }, _callee2, undefined, [[2, 14]]);
  }));

  return function (_x4, _x5, _x6) {
    return _ref2.apply(this, arguments);
  };
}();

exports.truncateAsset = function (req, res, next) {
  var spaceId = req.params.space_id;
  Space.findOne({ _id: spaceId }, function (err, space) {
    if (err) next(err);
    space.assets.clear();
    space.save(function (errSave) {
      if (errSave) _helper.handleError(errSave, next);

      Asset.remove({ _spaceId: spaceId }, function (err2) {
        if (err2) _helper.handleError(err2, next);
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