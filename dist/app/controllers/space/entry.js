'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var mongoose = require('mongoose');
var mongooseObject = mongoose.Types.ObjectId;
var _ = require('lodash');

var Entry = require('../../models/Entry');
var Space = require('../../models/Space');
var _helper = require('./helper');

/**
 * Entries
 */

var checkObjectId = function checkObjectId(data) {
    if ((typeof data === 'undefined' ? 'undefined' : _typeof(data)) !== 'object') {
        if (!mongooseObject.isValid(data)) throw { error: 'Not objectID!!' };
    } else {
        for (var keyData in data) {
            if (!mongooseObject.isValid(data[keyData])) throw { error: 'Not objectID!!' };
        }
    }
    return true;
};

var getQuery = function getQuery(q) {
    var queryString = {
        "content_type": "contentTypeId",
        'eq': '$eq',
        'ne': '$ne',
        'gt': '$gt',
        'gte': '$gte',
        'lt': '$lt',
        'lte': '$lte',
        'in': '$in',
        'nin': '$nin'
    };
    var isObjectId = ["_id", "contentTypeId", "_spaceId"];

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

        var reqQuery, select, skip, limit, _getQuery, _query;

        return regeneratorRuntime.wrap(function _callee$(_context) {
            while (1) {
                switch (_context.prev = _context.next) {
                    case 0:
                        reqQuery = _extends({}, query);
                        select = "", skip = 0, limit = 0;

                        if (reqQuery.select) {
                            select = reqQuery.select;
                            delete reqQuery.select;
                        }
                        if (reqQuery.skip) {
                            skip = parseInt(reqQuery.skip);
                            delete reqQuery.skip;
                        }
                        if (reqQuery.limit) {
                            limit = parseInt(reqQuery.limit);
                            delete reqQuery.limit;
                        }

                        _getQuery = getQuery(reqQuery);


                        checkObjectId(spaceId);

                        _query = _extends({}, _getQuery, {
                            _spaceId: { $eq: spaceId }
                        });

                        if (entryId !== null) {
                            checkObjectId(entryId);
                            _query["_id"] = { $eq: entryId };
                        }
                        //        console.log(_query);

                        _context.next = 11;
                        return Entry.find(_query).select(select).limit(limit).skip(skip);

                    case 11:
                        return _context.abrupt('return', _context.sent);

                    case 12:
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

exports.getAllEntries = function () {
    var _ref2 = _asyncToGenerator(regeneratorRuntime.mark(function _callee2(req, res, next) {
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

    return function (_x4, _x5, _x6) {
        return _ref2.apply(this, arguments);
    };
}();

exports.getSingleEntry = function () {
    var _ref3 = _asyncToGenerator(regeneratorRuntime.mark(function _callee3(req, res, next) {
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

    return function (_x7, _x8, _x9) {
        return _ref3.apply(this, arguments);
    };
}();

// UPDATE CONTENT TYPE
var updateEntry = function updateEntry(req, res, next) {

    var spaceId = req.params.space_id;
    var entryId = req.params.entry_id;
    var contentTypeId = req.headers['x-cic-content-type'];
    var fields = req.body.fields;
    var status = req.body.status;
    console.log('updateEntry', fields);

    Space.findOne({ _id: spaceId }, function (err, space) {
        if (err) {
            return next(err);
        }

        // Check contentType
        var contentTypeInfo = _.find(space.contentTypes, function (ct) {
            return ct._id.equals(contentTypeId);
        });

        if (!contentTypeInfo) {
            res.json({
                status: 'UNSUCCESSFUL',
                detail: 'Invalid contentType ' + contentTypeId
            });
            return;
        }

        var isExistingInSpace = _.find(space.entries, function (entry) {
            return entry.equals(entryId);
        });
        if (isExistingInSpace) {

            var validation = _helper.validateFields(fields, contentTypeInfo);
            if (!validation.valid) {
                res.json({
                    status: 'UNSUCCESSFUL',
                    message: validation.message
                });
                return;
            }

            // Not update spaces.entry
            // Update entry
            Entry.findOne({ _id: entryId }, function (err, entry) {
                entry.fields = fields;
                entry.status = status;
                entry.save(function (err1) {
                    if (err1) return _helper.handleError(err1, next);
                    res.json({
                        status: 'SUCCESS',
                        detail: 'Updating entry successfully',
                        entry: entry
                    });
                });
            });
        } else {
            // 1. Create and Insert new entry
            // 2. Update spaces.entry
            var newEntry = new Entry({
                contentTypeId: contentTypeId,
                fields: fields,
                status: 'draft',
                _spaceId: spaceId
            });

            newEntry.save(function (err) {
                if (err) return _helper.handleError(err, next);

                // Update space
                space.entries.push(newEntry._id);
                space.save(function (err2) {
                    if (err2) {
                        return next(err2);
                    }
                    res.json({
                        status: 'SUCCESS',
                        detail: 'Create new entry successfully',
                        entry: newEntry
                    });
                });
            });
        }
    });
};

exports.updateEntry = updateEntry;

// CREATE CONTENT TYPE
exports.createEntry = function (req, res, next) {
    // Create new objectId
    var entryId = mongoose.Types.ObjectId();
    req.params.entry_id = entryId;
    return updateEntry(req, res, next);
};

exports.deleteEntry = function (req, res, next) {
    var spaceId = req.params.space_id;
    var entryId = req.params.entry_id;
    Entry.remove({ _id: entryId }, function (err) {
        if (err) return _helper.handleError(err, next);

        // Remove entry ref from space
        Space.findOne({ _id: spaceId }, function (err, space) {
            if (err) return _helper.handleError(err, next);
            space.entries = _.filter(space.entries, function (_id) {
                return !_id.equals(entryId);
            });

            space.save(function (err2) {
                if (err2) return _helper.handleError(err2, next);
                res.json({
                    status: 'SUCCESS',
                    detail: 'delete entry successfully'
                });
            });
        });
    });
};

exports.truncateEntry = function (req, res, next) {
    var spaceId = req.params.space_id;
    Space.findOne({ _id: spaceId }, function (err, space) {
        if (err) {
            return next(err);
        }
        space.entries = [];
        space.save(function (err) {
            if (err) return _helper.handleError(err, next);

            Entry.remove({ _spaceId: spaceId }, function (err2) {
                if (err2) return _helper.handleError(err2, next);
                res.json({
                    status: 'SUCCESS',
                    detail: 'clear all entries in space successfully',
                    space: space
                });
            });
        });
    });
};
//# sourceMappingURL=entry.js.map