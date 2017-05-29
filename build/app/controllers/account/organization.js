'use strict';

var _index = require('../space/index');

var _jwtUtils = require('../../utils/jwtUtils');

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var mongoose = require('mongoose');

var _ = require('lodash');
var Organization = require('../../models/Organization');

var mongooseObject = mongoose.Types.ObjectId;

exports.getAll = function () {
  var _ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee(req, res) {
    var organizations;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return Organization.find({});

          case 2:
            organizations = _context.sent;


            res.json({
              items: organizations
            });

          case 4:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, undefined);
  }));

  return function (_x, _x2) {
    return _ref.apply(this, arguments);
  };
}();

exports.getSingle = function () {
  var _ref2 = _asyncToGenerator(regeneratorRuntime.mark(function _callee2(req, res, next) {
    var organizationId;
    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            organizationId = req.params.organization_id;

            Organization.findOne({ _id: organizationId }).exec(function (err, organization) {
              if (err) next(err);
              res.json({
                title: 'find organization',
                organization: organization
              });
            });

          case 2:
          case 'end':
            return _context2.stop();
        }
      }
    }, _callee2, undefined);
  }));

  return function (_x3, _x4, _x5) {
    return _ref2.apply(this, arguments);
  };
}();

exports.createOrganization = function () {
  var _ref3 = _asyncToGenerator(regeneratorRuntime.mark(function _callee3(req, res, next) {
    var userOpenId, user, organization;
    return regeneratorRuntime.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            _context3.prev = 0;
            userOpenId = (0, _jwtUtils.getIdentityFromToken)(req);
            _context3.next = 4;
            return (0, _index.getUserFromIdentity)(userOpenId);

          case 4:
            user = _context3.sent;


            // console.log("user:: ", user);

            organization = new Organization();

            organization.name = req.body.name;

            organization.users.Owners = [user._id];

            // console.log("organization:: ", organization);

            user.organizations.push(organization._id); // Add organizations to User

            _context3.next = 11;
            return organization.save();

          case 11:
            _context3.next = 13;
            return user.save();

          case 13:

            res.json({
              status: 'success',
              item: organization
            });
            _context3.next = 19;
            break;

          case 16:
            _context3.prev = 16;
            _context3.t0 = _context3['catch'](0);

            next(_context3.t0);

          case 19:
          case 'end':
            return _context3.stop();
        }
      }
    }, _callee3, undefined, [[0, 16]]);
  }));

  return function (_x6, _x7, _x8) {
    return _ref3.apply(this, arguments);
  };
}();

exports.getAllMemberOrganization = function () {
  var _ref4 = _asyncToGenerator(regeneratorRuntime.mark(function _callee4(req, res, next) {
    var organizationId, result;
    return regeneratorRuntime.wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            organizationId = req.params.organization_id;
            _context4.prev = 1;

            if (mongooseObject.isValid(organizationId)) {
              _context4.next = 4;
              break;
            }

            throw new Error('Not objectId');

          case 4:
            _context4.next = 6;
            return Organization.find({ _id: organizationId }).populate('users.Members');

          case 6:
            result = _context4.sent;


            res.json({
              organization: organizationId,
              members: result[0].users.Members
            });
            _context4.next = 13;
            break;

          case 10:
            _context4.prev = 10;
            _context4.t0 = _context4['catch'](1);

            next(_context4.t0);

          case 13:
          case 'end':
            return _context4.stop();
        }
      }
    }, _callee4, undefined, [[1, 10]]);
  }));

  return function (_x9, _x10, _x11) {
    return _ref4.apply(this, arguments);
  };
}();

exports.delMemberOrganization = function () {
  var _ref5 = _asyncToGenerator(regeneratorRuntime.mark(function _callee5(req, res, next) {
    var organizationId, userId;
    return regeneratorRuntime.wrap(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            _context5.prev = 0;
            organizationId = req.params.organization_id;
            userId = req.params.user_id;
            _context5.next = 5;
            return Organization.update({
              _id: organizationId }, {
              $pull: {
                'users.Members': userId
              }
            });

          case 5:

            res.json({
              status: 'SUCCESS'
            });
            _context5.next = 11;
            break;

          case 8:
            _context5.prev = 8;
            _context5.t0 = _context5['catch'](0);

            next(_context5.t0);

          case 11:
          case 'end':
            return _context5.stop();
        }
      }
    }, _callee5, undefined, [[0, 8]]);
  }));

  return function (_x12, _x13, _x14) {
    return _ref5.apply(this, arguments);
  };
}();

exports.createMemberOrganization = function () {
  var _ref6 = _asyncToGenerator(regeneratorRuntime.mark(function _callee6(req, res, next) {
    var userId, organizationId, checkMember;
    return regeneratorRuntime.wrap(function _callee6$(_context6) {
      while (1) {
        switch (_context6.prev = _context6.next) {
          case 0:
            _context6.prev = 0;
            userId = req.body.user_id;
            organizationId = req.params.organization_id;

            // const organization = await Organization.find({ _id: organizationId });
            // console.log("find organization:: ", organization);
            // organization[0].users.Members.push(userId);

            // const organization = new Organization();
            // organization.update( { "_id": organizationId },
            // { "users.Members": userId },
            // { upsert: true } )

            // const organization = await Organization.findOne({ _id: organizationId });
            // organization.users.Members.push(userId);
            //
            // const result = await organization.save();

            _context6.next = 5;
            return Organization.find({ 'users.Members': userId });

          case 5:
            checkMember = _context6.sent;

            if (_.isEmpty(checkMember)) {
              _context6.next = 10;
              break;
            }

            // console.log("IF");
            res.json({
              status: 'มีแล้ว ไม่แอดแล้ว'
            });
            _context6.next = 13;
            break;

          case 10:
            _context6.next = 12;
            return Organization.update({
              _id: organizationId
            }, {
              $push: {
                'users.Members': userId
              }
            });

          case 12:

            res.json({
              status: 'SUCCESS'
            });

          case 13:
            _context6.next = 18;
            break;

          case 15:
            _context6.prev = 15;
            _context6.t0 = _context6['catch'](0);

            next(_context6.t0);

          case 18:
          case 'end':
            return _context6.stop();
        }
      }
    }, _callee6, undefined, [[0, 15]]);
  }));

  return function (_x15, _x16, _x17) {
    return _ref6.apply(this, arguments);
  };
}();
//# sourceMappingURL=organization.js.map