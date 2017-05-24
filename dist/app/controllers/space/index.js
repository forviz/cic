'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getUserFromIdentity = undefined;

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _jwtUtils = require('../../utils/jwtUtils');

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var mongoose = require('mongoose');
var _ = require('lodash');

var Space = require('../../models/Space');
var User = require('../../models/User');
var Organization = require('../../models/Organization');

/**
 * Get
 */
var getUserFromIdentity = exports.getUserFromIdentity = function () {
  var _ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee(identity) {
    var user, newUser, _$split, _$split2, provider, providerId, result;

    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.prev = 0;
            _context.next = 3;
            return User.findByIdentity(identity);

          case 3:
            user = _context.sent;

            if (!user) {
              _context.next = 6;
              break;
            }

            return _context.abrupt('return', user);

          case 6:

            // Else create new one
            newUser = new User();

            newUser.email = '';
            _$split = _.split(identity, '|'), _$split2 = _slicedToArray(_$split, 2), provider = _$split2[0], providerId = _$split2[1];

            newUser.identities = [{
              provider: provider,
              user_id: providerId,
              connection: provider,
              isSocial: true
            }];
            _context.next = 12;
            return newUser.save();

          case 12:
            result = _context.sent;
            return _context.abrupt('return', newUser);

          case 16:
            _context.prev = 16;
            _context.t0 = _context['catch'](0);

            console.log(_context.t0);

          case 19:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, undefined, [[0, 16]]);
  }));

  return function getUserFromIdentity(_x) {
    return _ref.apply(this, arguments);
  };
}();

var getOrganizationsFromUser = function () {
  var _ref2 = _asyncToGenerator(regeneratorRuntime.mark(function _callee2(user) {
    var organizations, newOrganization;
    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.prev = 0;
            _context2.next = 3;
            return Organization.findByIdentity(user._id);

          case 3:
            organizations = _context2.sent;

            console.log('check organizations', organizations);

            if (_.isEmpty(organizations)) {
              _context2.next = 7;
              break;
            }

            return _context2.abrupt('return', organizations);

          case 7:

            // Else create new one
            newOrganization = new Organization();

            newOrganization.name = 'Default';
            newOrganization.users.Owners = [user._id];

            user.organizations.push(newOrganization._id);
            _context2.next = 13;
            return user.save();

          case 13:
            _context2.next = 15;
            return newOrganization.save();

          case 15:
            return _context2.abrupt('return', [newOrganization]);

          case 18:
            _context2.prev = 18;
            _context2.t0 = _context2['catch'](0);

            console.log(_context2.t0);

          case 21:
          case 'end':
            return _context2.stop();
        }
      }
    }, _callee2, undefined, [[0, 18]]);
  }));

  return function getOrganizationsFromUser(_x2) {
    return _ref2.apply(this, arguments);
  };
}();

// exports.getAll = (req, res, next) => {
//
//   const userOpenId = getUserFromToken(req);
//   User.findByIdentity(userOpenId, (err, user) => {
//     console.log('userOpenId', userOpenId, user);
//   });
//
//   Space.find({}, (err, spaces) => {
//     if (err) { return next(err); }
//     res.json({
//       items: spaces,
//     });
//   });
// };

exports.getAll = function () {
  var _ref3 = _asyncToGenerator(regeneratorRuntime.mark(function _callee3(req, res, next) {
    var userOpenId, user, userOrgazation, result;
    return regeneratorRuntime.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            userOpenId = (0, _jwtUtils.getIdentityFromToken)(req);
            _context3.next = 3;
            return getUserFromIdentity(userOpenId);

          case 3:
            user = _context3.sent;


            console.log("userId:: ", user._id);

            _context3.prev = 5;
            _context3.next = 8;
            return Organization.find({ $or: [{ 'users.Members': user._id }, { 'users.Owners': user._id }] });

          case 8:
            userOrgazation = _context3.sent;
            _context3.next = 11;
            return Space.find({
              organization: { $in: _.map(userOrgazation, '_id') }
            });

          case 11:
            result = _context3.sent;


            res.json({
              items: result
            });
            _context3.next = 18;
            break;

          case 15:
            _context3.prev = 15;
            _context3.t0 = _context3['catch'](5);

            next(_context3.t0);

          case 18:
          case 'end':
            return _context3.stop();
        }
      }
    }, _callee3, undefined, [[5, 15]]);
  }));

  return function (_x3, _x4, _x5) {
    return _ref3.apply(this, arguments);
  };
}();

exports.getSingle = function (req, res, next) {
  var spaceId = req.params.space_id;
  Space.findOne({ _id: spaceId }).exec(function (err, space) {
    if (err) {
      return next(err);
    }
    res.json({
      title: 'find space',
      space: space
    });
  });
};

exports.updateSpace = function (req, res, next) {};

exports.createSpace = function () {
  var _ref4 = _asyncToGenerator(regeneratorRuntime.mark(function _callee4(req, res, next) {
    var spaceName, defaultLocale, userOpenId, user, organizations, organizationToUse, space;
    return regeneratorRuntime.wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            spaceName = req.body.name;
            defaultLocale = req.body.defaultLocale;
            userOpenId = (0, _jwtUtils.getIdentityFromToken)(req);
            _context4.next = 5;
            return getUserFromIdentity(userOpenId);

          case 5:
            user = _context4.sent;

            console.log("userOpenId:: ", userOpenId);
            console.log("user createSpace:: ", user);

            _context4.next = 10;
            return getOrganizationsFromUser(user);

          case 10:
            organizations = _context4.sent;

            console.log("organization:: ", organizations);

            organizationToUse = organizations[0];
            space = new Space({
              name: spaceName,
              defaultLocale: defaultLocale,
              users: [user._id],
              organization: organizationToUse._id
            });


            organizationToUse.spaces.push(space._id);

            _context4.next = 17;
            return space.save();

          case 17:
            _context4.next = 19;
            return organizationToUse.save();

          case 19:

            // space.save((err) => {
            //   if (err) { return next(err); }
            res.json({
              status: 'SUCCESS',
              detail: 'Create space successfully',
              space: space,
              user: user,
              organization: organizationToUse
            });
            // });

          case 20:
          case 'end':
            return _context4.stop();
        }
      }
    }, _callee4, undefined);
  }));

  return function (_x6, _x7, _x8) {
    return _ref4.apply(this, arguments);
  };
}();
/*exports.createSpace = async (req, res, next) => {
  const spaceName = req.body.name;
  const defaultLocale = req.body.defaultLocale;
  // const organization_id = req.body.organization_id;

  const userOpenId = getIdentityFromToken(req);
  const user = await getUserFromIdentity(userOpenId);

  const organization2 = await getOrganizationFromIdentity(userOpenId);

  console.log("user:: ", user);
  console.log("organization:: ", organization2);

  const space = new Space({
    name: spaceName,
    defaultLocale,
    users: [user._id],
    //organization: organization_id
  });

  const organization = new Organization();
  organization.spaces = [space._id];

  // await space.save();
  // await user.save();

  // space.save((err) => {
  //   if (err) { return next(err); }
  //   res.json({
  //     status: 'SUCCESS',
  //     detail: 'Create space successfully',
  //     space: space,
  //   });
  // });
};*/

exports.deleteSpace = function (req, res, next) {
  var spaceId = req.params.space_id;
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
      space.remove();
      res.json({
        status: 'SUCCESSFUL',
        message: 'Delete successfully'
      });
    }
  });
};
//# sourceMappingURL=index.js.map