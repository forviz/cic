'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var mongoose = require('mongoose');
var _ = require('lodash');

var Entry = require('../../models/Entry');
var Space = require('../../models/Space');
var helper = require('./helper');

var mongooseObject = mongoose.Types.ObjectId;

/**
 * Entries
 */
/* eslint-disable guard-for-in, no-restricted-syntax */
var checkObjectId = function checkObjectId(data) {
  if ((typeof data === 'undefined' ? 'undefined' : _typeof(data)) !== 'object') {
    if (!mongooseObject.isValid(data)) throw new Error('Not objectID!!');
  } else {
    for (var keyData in data) {
      if (!mongooseObject.isValid(data[keyData])) throw new Error('Not objectID!!');
    }
  }
  return true;
};

var getQuery = function getQuery(q) {
  var queryString = {
    content_type: 'contentTypeId',
    eq: '$eq',
    ne: '$ne',
    gt: '$gt',
    gte: '$gte',
    lt: '$lt',
    lte: '$lte',
    in: '$in',
    nin: '$nin'
  };
  var isObjectId = ['_id', 'contentTypeId', '_spaceId'];

  var _q = {};
  for (var key in q) {
    var keyQuery = queryString[key] ? queryString[key] : key;
    if (_typeof(q[key]) === 'object') {
      for (var __key in q[key]) {
        if (queryString[__key]) {
          if (_typeof(_q[keyQuery]) !== 'object') {
            _q[keyQuery] = {};
          }
          var tempVal = __key === 'in' || __key === 'nin' ? q[key][__key].split(',') : q[key][__key];
          _q[keyQuery][queryString[__key]] = tempVal;
        }
      }
    } else {
      _q[keyQuery] = {
        $eq: q[key]
      };
    }
    if (isObjectId.indexOf(keyQuery) >= 0) {
      for (var tempIndex in _q[keyQuery]) {
        checkObjectId(_q[keyQuery][tempIndex]);
      }
    }
  }

  return _q;
};

var getEntry = function () {
  var _ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee(query, spaceId) {
    var entryId = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;

    var reqQuery, select, skip, limit, _getQuery, _query, result;

    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            reqQuery = _extends({}, query);
            select = '';
            skip = 0;
            limit = 0;


            if (reqQuery.select) {
              select = reqQuery.select;
              delete reqQuery.select;
            }
            if (reqQuery.skip) {
              skip = parseInt(reqQuery.skip, 10);
              delete reqQuery.skip;
            }
            if (reqQuery.limit) {
              limit = parseInt(reqQuery.limit, 10);
              delete reqQuery.limit;
            }

            _getQuery = getQuery(reqQuery);


            checkObjectId(spaceId);

            _query = _extends({}, _getQuery, {
              _spaceId: { $eq: spaceId }
            });

            if (entryId !== null) {
              checkObjectId(entryId);
              _query._id = { $eq: entryId };
            }

            _context.next = 13;
            return Entry.find(_query).select(select).limit(limit).skip(skip);

          case 13:
            result = _context.sent;
            return _context.abrupt('return', result);

          case 15:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, undefined);
  }));

  return function getEntry(_x, _x2) {
    return _ref.apply(this, arguments);
  };
}();
/* eslint-enable guard-for-in, no-restricted-syntax */

exports.getAllEntries = function () {
  var _ref2 = _asyncToGenerator(regeneratorRuntime.mark(function _callee2(req, res) {
    var spaceId, reqQuery, result;
    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.prev = 0;
            spaceId = req.params.space_id;
            reqQuery = req.query;
            _context2.next = 5;
            return getEntry(reqQuery, spaceId);

          case 5:
            result = _context2.sent;

            res.json({
              items: result
            });
            _context2.next = 12;
            break;

          case 9:
            _context2.prev = 9;
            _context2.t0 = _context2['catch'](0);

            res.status(500).json(_context2.t0);

          case 12:
          case 'end':
            return _context2.stop();
        }
      }
    }, _callee2, undefined, [[0, 9]]);
  }));

  return function (_x4, _x5) {
    return _ref2.apply(this, arguments);
  };
}();

exports.getSingleEntry = function () {
  var _ref3 = _asyncToGenerator(regeneratorRuntime.mark(function _callee3(req, res) {
    var spaceId, entryId, reqQuery, result;
    return regeneratorRuntime.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            _context3.prev = 0;
            spaceId = req.params.space_id;
            entryId = req.params.entry_id;
            reqQuery = req.query;
            _context3.next = 6;
            return getEntry(reqQuery, spaceId, entryId);

          case 6:
            result = _context3.sent;

            res.json({
              item: result.length > 0 ? result[0] : []
            });
            _context3.next = 13;
            break;

          case 10:
            _context3.prev = 10;
            _context3.t0 = _context3['catch'](0);

            res.status(500).json(_context3.t0);

          case 13:
          case 'end':
            return _context3.stop();
        }
      }
    }, _callee3, undefined, [[0, 10]]);
  }));

  return function (_x6, _x7) {
    return _ref3.apply(this, arguments);
  };
}();

// UPDATE CONTENT TYPE
var updateEntry = function () {
  var _ref4 = _asyncToGenerator(regeneratorRuntime.mark(function _callee4(req, res, next) {
    var spaceId, entryId, contentTypeId, fields, status, space, contentTypeInfo, validation, entry;
    return regeneratorRuntime.wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            spaceId = req.params.space_id;
            entryId = req.params.entry_id;
            contentTypeId = req.headers['x-cic-content-type'];
            fields = req.body.fields;
            status = req.body.status;
            _context4.prev = 5;
            _context4.next = 8;
            return Space.findOne({ _id: spaceId });

          case 8:
            space = _context4.sent;
            contentTypeInfo = _.find(space.contentTypes, function (ct) {
              return ct._id.equals(contentTypeId);
            });

            if (contentTypeInfo) {
              _context4.next = 13;
              break;
            }

            res.json({
              status: 'UNSUCCESSFUL',
              detail: 'Invalid contentType ' + contentTypeId
            });
            return _context4.abrupt('return');

          case 13:
            validation = helper.validateFields(fields, contentTypeInfo);

            if (validation.valid) {
              _context4.next = 17;
              break;
            }

            res.json({
              status: 'UNSUCCESSFUL',
              message: validation.message
            });
            return _context4.abrupt('return');

          case 17:
            _context4.next = 19;
            return Entry.findOneAndUpdate({ _id: entryId }, {
              contentTypeId: contentTypeId,
              fields: fields,
              status: status || 'draft',
              _spaceId: spaceId
            }, {
              new: true,
              upsert: true
            });

          case 19:
            entry = _context4.sent;


            // Add to space.entires if not exists
            space.entries = _.uniq([].concat(_toConsumableArray(space.entries), [entry._id]));
            _context4.next = 23;
            return space.save();

          case 23:

            res.json({
              status: 'SUCCESS',
              detail: 'Create new entry successfully',
              entry: entry
            });
            _context4.next = 29;
            break;

          case 26:
            _context4.prev = 26;
            _context4.t0 = _context4['catch'](5);

            next(_context4.t0);

          case 29:
          case 'end':
            return _context4.stop();
        }
      }
    }, _callee4, undefined, [[5, 26]]);
  }));

  return function updateEntry(_x8, _x9, _x10) {
    return _ref4.apply(this, arguments);
  };
}();

exports.updateEntry = updateEntry;

// CREATE CONTENT TYPE
exports.createEntry = function (req, res, next) {
  // Create new objectId
  var entryId = mongoose.Types.ObjectId();
  req.params.entry_id = entryId;
  return updateEntry(req, res, next);
};

exports.deleteEntry = function () {
  var _ref5 = _asyncToGenerator(regeneratorRuntime.mark(function _callee5(req, res, next) {
    var spaceId, entryId, space;
    return regeneratorRuntime.wrap(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            spaceId = req.params.space_id;
            entryId = req.params.entry_id;
            _context5.prev = 2;
            _context5.next = 5;
            return Entry.remove({ _id: entryId });

          case 5:
            _context5.next = 7;
            return Space.findOne({ _id: spaceId });

          case 7:
            space = _context5.sent;

            space.entries = _.filter(space.entries, function (_id) {
              return !_id.equals(entryId);
            });
            _context5.next = 11;
            return space.save();

          case 11:

            res.json({
              status: 'SUCCESS',
              detail: 'delete entry successfully'
            });
            _context5.next = 17;
            break;

          case 14:
            _context5.prev = 14;
            _context5.t0 = _context5['catch'](2);

            next(_context5.t0);

          case 17:
          case 'end':
            return _context5.stop();
        }
      }
    }, _callee5, undefined, [[2, 14]]);
  }));

  return function (_x11, _x12, _x13) {
    return _ref5.apply(this, arguments);
  };
}();

exports.truncateEntry = function () {
  var _ref6 = _asyncToGenerator(regeneratorRuntime.mark(function _callee6(req, res, next) {
    var spaceId, space;
    return regeneratorRuntime.wrap(function _callee6$(_context6) {
      while (1) {
        switch (_context6.prev = _context6.next) {
          case 0:
            spaceId = req.params.space_id;
            _context6.prev = 1;
            _context6.next = 4;
            return Entry.remove({ _spaceId: spaceId });

          case 4:
            _context6.next = 6;
            return Space.findOne({ _id: spaceId });

          case 6:
            space = _context6.sent;

            space.entries = [];
            _context6.next = 10;
            return space.save();

          case 10:

            res.json({
              status: 'SUCCESS',
              detail: 'clear all entries in space successfully',
              space: space
            });
            _context6.next = 16;
            break;

          case 13:
            _context6.prev = 13;
            _context6.t0 = _context6['catch'](1);

            next(_context6.t0);

          case 16:
          case 'end':
            return _context6.stop();
        }
      }
    }, _callee6, undefined, [[1, 13]]);
  }));

  return function (_x14, _x15, _x16) {
    return _ref6.apply(this, arguments);
  };
}();
//# sourceMappingURL=entry.js.map