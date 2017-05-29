'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var mongoose = require('mongoose');
var _ = require('lodash');

var Space = require('../../models/Space');

/**
 * Content Types
 */
exports.getAllContentTypes = function (req, res, next) {
  var spaceId = req.params.space_id;
  Space.findOne({ _id: spaceId }, function (err, theSpace) {
    if (err) next(err);
    res.json({
      types: theSpace.contentTypes
    });
  });
};

exports.getSingleContentType = function (req, res, next) {
  var spaceId = req.params.space_id;
  var contentTypeId = req.params.content_type_id;
  Space.findOne({ _id: spaceId }, function (err, space) {
    if (err) next(err);

    var contentType = _.find(space.contentTypes, function (ct) {
      return ct._id.equals(contentTypeId);
    });
    if (contentType) {
      res.json({
        type: contentType
      });
    }
  });
};

// UPDATE CONTENT TYPE
var updateContentType = function () {
  var _ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee(req, res, next) {
    var spaceId, contentTypeId, name, displayField, identifier, fields, space, contentTypeToUpdate, index;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            spaceId = req.params.space_id;
            contentTypeId = req.params.content_type_id;
            name = req.body.name;
            displayField = req.body.displayField;
            identifier = req.body.identifier;
            fields = req.body.fields;
            _context.prev = 6;
            _context.next = 9;
            return Space.findOne({ _id: spaceId });

          case 9:
            space = _context.sent;
            contentTypeToUpdate = {
              _id: contentTypeId,
              name: name,
              identifier: identifier,
              displayField: displayField,
              fields: _.map(fields, function (fld) {
                if (fld._id === '') return _extends({}, fld, { _id: mongoose.Types.ObjectId() });
                return fld;
              }),
              dateUpdated: Date.now()
            };
            index = _.findIndex(space.contentTypes, function (ct) {
              return ct._id.equals(contentTypeId);
            });


            if (index > -1) {
              // Existing
              space.contentTypes[index] = contentTypeToUpdate;
            } else {
              // New
              space.contentTypes.push(contentTypeToUpdate);
            }

            _context.next = 15;
            return space.save();

          case 15:

            res.json({
              status: 'SUCCESS',
              detail: 'update content type successfully',
              sys: {
                type: 'ContentType',
                id: contentTypeId,
                updatedAt: Date.now()
              },
              space: space
            });
            _context.next = 21;
            break;

          case 18:
            _context.prev = 18;
            _context.t0 = _context['catch'](6);

            next(_context.t0);

          case 21:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, undefined, [[6, 18]]);
  }));

  return function updateContentType(_x, _x2, _x3) {
    return _ref.apply(this, arguments);
  };
}();

exports.updateContentType = updateContentType;

// CREATE CONTENT TYPE
exports.createContentType = function (req, res, next) {
  // Create new objectId
  var contentTypeId = mongoose.Types.ObjectId();
  req.params.content_type_id = contentTypeId;
  return updateContentType(req, res, next);
};

// DELETE CONTENT TYPE
exports.deleteContentType = function () {
  var _ref2 = _asyncToGenerator(regeneratorRuntime.mark(function _callee2(req, res, next) {
    var spaceId, contentTypeId, space;
    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            spaceId = req.params.space_id;
            contentTypeId = req.params.content_type_id;
            _context2.prev = 2;
            _context2.next = 5;
            return Space.findOne({ _id: spaceId });

          case 5:
            space = _context2.sent;

            space.contentTypes = _.filter(space.contentTypes, function (ct) {
              return !ct._id.equals(contentTypeId);
            });
            _context2.next = 9;
            return space.save();

          case 9:

            res.json({
              status: 'SUCCESSFUL',
              message: 'Delete contentType successfully'
            });
            _context2.next = 15;
            break;

          case 12:
            _context2.prev = 12;
            _context2.t0 = _context2['catch'](2);

            next(_context2.t0);

          case 15:
          case 'end':
            return _context2.stop();
        }
      }
    }, _callee2, undefined, [[2, 12]]);
  }));

  return function (_x4, _x5, _x6) {
    return _ref2.apply(this, arguments);
  };
}();
//# sourceMappingURL=contentType.js.map