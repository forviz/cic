'use strict';

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var cuid = require('cuid');
var mongoose = require('mongoose');
var Space = require('../../models/Space');

exports.getAllKey = function (req, res, next) {
  var spaceId = req.params.space_id;
  Space.findOne({ _id: spaceId }, function (err, space) {
    if (err) {
      return next(err);
    }

    space.save(function (err) {
      if (err) next(err);
      res.json({
        title: 'Keys',
        items: space.apiKeys
      });
    });
  });
};

exports.clearAllKey = function (req, res, next) {
  var spaceId = req.params.space_id;
  Space.findOne({ _id: spaceId }, function (err, space) {
    if (err) {
      return next(err);
    }

    space.apiKeys = [];

    space.save(function (err) {
      if (err) next(err);
      res.json({
        title: 'Cleared key',
        space: space
      });
    });
  });
};

exports.updateKey = function (req, res, next) {

  var spaceId = req.params.space_id;
  var keyId = req.params.key_id;
  var name = req.body.name;


  Space.findOne({ _id: spaceId }, function (err, space) {
    if (err) {
      return next(err);
    }

    var isExisting = _lodash2.default.find(space.apiKeys, function (k) {
      return k._id.equals(keyId);
    });

    if (isExisting) {
      // TODO:
      // Update existing noe
      space.apiKeys = _lodash2.default.map(space.apiKeys, function (apiKey) {

        if (apiKey._id.equals(keyId)) {
          return {
            _id: apiKey._id,
            name: name
          };
        }
        return apiKey;
      });

      space.save(function (err) {
        if (err) next(err);
        res.json({
          title: 'Updated key',
          space: space
        });
      });
    }
  });
};

exports.createKey = function (req, res, next) {

  var spaceId = req.params.space_id;

  var name = req.body.name;

  var objectId = mongoose.Types.ObjectId();
  var deliveryKey = cuid();
  var previewKey = cuid();
  var expireDate = req.body.expire_date;

  Space.findOne({ _id: spaceId }, function (err, space) {
    if (err) {
      return next(err);
    }

    var key = {
      _id: objectId,
      name: name || space.name,
      deliveryKey: deliveryKey,
      previewKey: previewKey,
      expireDate: expireDate
    };

    space.apiKeys.push(key);

    space.save(function (err) {
      if (err) next(err);
      res.json({
        title: 'Added key',
        item: key,
        space: space
      });
    });
  });
};

// DELETE KEY
exports.deleteKey = function (req, res, next) {
  var spaceId = req.params.space_id;
  var keyId = req.params.key_id;

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
      space.apiKeys = _lodash2.default.filter(space.apiKeys, function (apiKey) {
        return !apiKey._id.equals(keyId);
      });

      space.save(function (err) {
        if (err) {
          return next(err);
        }
        res.json({
          status: 'SUCCESSFUL',
          message: 'Delete apiKey successfully'
        });
      });
    }
  });
};
//# sourceMappingURL=apikey.js.map