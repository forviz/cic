'use strict';

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var cuid = require('cuid');
var mongoose = require('mongoose');
var Space = require('../../models/Space');

exports.getAllKey = function () {
  var _ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee(req, res, next) {
    var spaceId, space;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            spaceId = req.params.space_id;
            _context.prev = 1;
            _context.next = 4;
            return Space.findOne({ _id: spaceId });

          case 4:
            space = _context.sent;

            res.json({
              title: 'Keys',
              items: space.apiKeys
            });
            _context.next = 11;
            break;

          case 8:
            _context.prev = 8;
            _context.t0 = _context['catch'](1);

            next(_context.t0);

          case 11:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, undefined, [[1, 8]]);
  }));

  return function (_x, _x2, _x3) {
    return _ref.apply(this, arguments);
  };
}();

exports.clearAllKey = function () {
  var _ref2 = _asyncToGenerator(regeneratorRuntime.mark(function _callee2(req, res, next) {
    var spaceId, space;
    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            spaceId = req.params.space_id;
            _context2.prev = 1;
            space = Space.findOne({ _id: spaceId });

            space.apiKeys = [];
            _context2.next = 6;
            return space.save();

          case 6:
            res.json({
              status: 'SUCCESSFUL',
              title: 'Cleared key',
              space: space
            });
            _context2.next = 12;
            break;

          case 9:
            _context2.prev = 9;
            _context2.t0 = _context2['catch'](1);

            next(_context2.t0);

          case 12:
          case 'end':
            return _context2.stop();
        }
      }
    }, _callee2, undefined, [[1, 9]]);
  }));

  return function (_x4, _x5, _x6) {
    return _ref2.apply(this, arguments);
  };
}();

exports.updateKey = function () {
  var _ref3 = _asyncToGenerator(regeneratorRuntime.mark(function _callee3(req, res, next) {
    var spaceId, keyId, name, space, isExisting;
    return regeneratorRuntime.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            spaceId = req.params.space_id;
            keyId = req.params.key_id;
            name = req.body.name;
            _context3.prev = 3;
            _context3.next = 6;
            return Space.findOne({ _id: spaceId });

          case 6:
            space = _context3.sent;
            isExisting = _lodash2.default.find(space.apiKeys, function (k) {
              return k._id.equals(keyId);
            });

            if (!isExisting) {
              _context3.next = 13;
              break;
            }

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

            _context3.next = 12;
            return space.save();

          case 12:
            res.json({
              title: 'Updated key',
              space: space
            });

          case 13:
            _context3.next = 18;
            break;

          case 15:
            _context3.prev = 15;
            _context3.t0 = _context3['catch'](3);

            next(_context3.t0);

          case 18:
          case 'end':
            return _context3.stop();
        }
      }
    }, _callee3, undefined, [[3, 15]]);
  }));

  return function (_x7, _x8, _x9) {
    return _ref3.apply(this, arguments);
  };
}();

exports.createKey = function (req, res, next) {
  var spaceId = req.params.space_id;

  var name = req.body.name;

  var objectId = mongoose.Types.ObjectId();
  var deliveryKey = cuid();
  var previewKey = cuid();
  var expireDate = req.body.expire_date;

  Space.findOne({ _id: spaceId }, function (err, space) {
    if (err) next(err);

    var key = {
      _id: objectId,
      name: name || space.name,
      deliveryKey: deliveryKey,
      previewKey: previewKey,
      expireDate: expireDate
    };

    space.apiKeys.push(key);

    space.save(function (err2) {
      if (err2) next(err2);
      res.json({
        title: 'Added key',
        item: key,
        space: space
      });
    });
  });
};

// DELETE KEY
exports.deleteKey = function () {
  var _ref4 = _asyncToGenerator(regeneratorRuntime.mark(function _callee4(req, res, next) {
    var spaceId, keyId, space;
    return regeneratorRuntime.wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            spaceId = req.params.space_id;
            keyId = req.params.key_id;
            _context4.prev = 2;
            _context4.next = 5;
            return Space.findOne({ _id: spaceId });

          case 5:
            space = _context4.sent;

            if (!space) {
              _context4.next = 11;
              break;
            }

            space.apiKeys = _lodash2.default.filter(space.apiKeys, function (apiKey) {
              return !apiKey._id.equals(keyId);
            });
            _context4.next = 10;
            return space.save();

          case 10:

            res.json({
              status: 'SUCCESSFUL',
              message: 'Delete apiKey successfully'
            });

          case 11:
            _context4.next = 16;
            break;

          case 13:
            _context4.prev = 13;
            _context4.t0 = _context4['catch'](2);

            next(_context4.t0);

          case 16:
          case 'end':
            return _context4.stop();
        }
      }
    }, _callee4, undefined, [[2, 13]]);
  }));

  return function (_x10, _x11, _x12) {
    return _ref4.apply(this, arguments);
  };
}();
//# sourceMappingURL=apikey.js.map