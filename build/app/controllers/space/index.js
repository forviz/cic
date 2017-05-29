'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getUserFromIdentity = undefined;

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _jwtUtils = require('../../utils/jwtUtils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var Space = require('../../models/Space');
var User = require('../../models/User');
var Organization = require('../../models/Organization');

/**
 * Get
 */
/* eslint-disable import/prefer-default-export */
var getUserFromIdentity = exports.getUserFromIdentity = function () {
  var _ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee(identity) {
    var user, newUser, _$split, _$split2, provider, providerId;

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
            _$split = _lodash2.default.split(identity, '|'), _$split2 = _slicedToArray(_$split, 2), provider = _$split2[0], providerId = _$split2[1];

            newUser.identities = [{
              provider: provider,
              user_id: providerId,
              connection: provider,
              isSocial: true
            }];
            _context.next = 12;
            return newUser.save();

          case 12:
            return _context.abrupt('return', newUser);

          case 15:
            _context.prev = 15;
            _context.t0 = _context['catch'](0);
            return _context.abrupt('return', _context.t0);

          case 18:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, undefined, [[0, 15]]);
  }));

  return function getUserFromIdentity(_x) {
    return _ref.apply(this, arguments);
  };
}();
/* eslint-enable import/prefer-default-export */

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

            if (_lodash2.default.isEmpty(organizations)) {
              _context2.next = 6;
              break;
            }

            return _context2.abrupt('return', organizations);

          case 6:

            // Else create new one
            newOrganization = new Organization();

            newOrganization.name = 'Default';
            newOrganization.users.Owners = [user._id];

            user.organizations.push(newOrganization._id);
            _context2.next = 12;
            return user.save();

          case 12:
            _context2.next = 14;
            return newOrganization.save();

          case 14:
            return _context2.abrupt('return', [newOrganization]);

          case 17:
            _context2.prev = 17;
            _context2.t0 = _context2['catch'](0);
            return _context2.abrupt('return', _context2.t0);

          case 20:
          case 'end':
            return _context2.stop();
        }
      }
    }, _callee2, undefined, [[0, 17]]);
  }));

  return function getOrganizationsFromUser(_x2) {
    return _ref2.apply(this, arguments);
  };
}();

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
            _context3.prev = 4;
            _context3.next = 7;
            return Organization.find({
              $or: [{ 'users.Members': user._id }, { 'users.Owners': user._id }]
            });

          case 7:
            userOrgazation = _context3.sent;
            _context3.next = 10;
            return Space.find({
              organization: { $in: _lodash2.default.map(userOrgazation, '_id') }
            });

          case 10:
            result = _context3.sent;


            res.json({
              items: result
            });
            _context3.next = 17;
            break;

          case 14:
            _context3.prev = 14;
            _context3.t0 = _context3['catch'](4);

            next(_context3.t0);

          case 17:
          case 'end':
            return _context3.stop();
        }
      }
    }, _callee3, undefined, [[4, 14]]);
  }));

  return function (_x3, _x4, _x5) {
    return _ref3.apply(this, arguments);
  };
}();

exports.getSingle = function () {
  var _ref4 = _asyncToGenerator(regeneratorRuntime.mark(function _callee4(req, res) {
    var spaceId, space;
    return regeneratorRuntime.wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            spaceId = req.params.space_id;
            _context4.prev = 1;
            _context4.next = 4;
            return Space.findOne({ _id: spaceId });

          case 4:
            space = _context4.sent;

            if (space !== null) {
              res.json({
                title: 'find space',
                space: space
              });
            }
            _context4.next = 11;
            break;

          case 8:
            _context4.prev = 8;
            _context4.t0 = _context4['catch'](1);

            res.status(404).json({
              message: 'The resource could not be found.',
              sys: {
                type: 'Error',
                id: 'NotFound'
              }
            });

          case 11:
          case 'end':
            return _context4.stop();
        }
      }
    }, _callee4, undefined, [[1, 8]]);
  }));

  return function (_x6, _x7) {
    return _ref4.apply(this, arguments);
  };
}();

exports.updateSpace = function () {
  var _ref5 = _asyncToGenerator(regeneratorRuntime.mark(function _callee5(req, res, next) {
    var spaceId, name, defaultLocale, space;
    return regeneratorRuntime.wrap(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            spaceId = req.params.space_id;
            name = req.body.name;
            defaultLocale = req.body.defaultLocale;
            _context5.prev = 3;
            _context5.next = 6;
            return Space.findOneAndUpdate({
              // condition
              _id: spaceId
            }, {
              // Doc
              name: name,
              defaultLocale: defaultLocale
            }, {
              new: true
            });

          case 6:
            space = _context5.sent;

            res.json({
              status: 'SUCCESS',
              detail: 'Update space successfully',
              space: space
            });
            _context5.next = 13;
            break;

          case 10:
            _context5.prev = 10;
            _context5.t0 = _context5['catch'](3);

            next(_context5.t0);

          case 13:
          case 'end':
            return _context5.stop();
        }
      }
    }, _callee5, undefined, [[3, 10]]);
  }));

  return function (_x8, _x9, _x10) {
    return _ref5.apply(this, arguments);
  };
}();

exports.createSpace = function () {
  var _ref6 = _asyncToGenerator(regeneratorRuntime.mark(function _callee6(req, res) {
    var spaceName, defaultLocale, userOpenId, user, organizations, organizationToUse, space;
    return regeneratorRuntime.wrap(function _callee6$(_context6) {
      while (1) {
        switch (_context6.prev = _context6.next) {
          case 0:
            spaceName = req.body.name;
            defaultLocale = req.body.defaultLocale;
            userOpenId = (0, _jwtUtils.getIdentityFromToken)(req);
            _context6.next = 5;
            return getUserFromIdentity(userOpenId);

          case 5:
            user = _context6.sent;
            _context6.next = 8;
            return getOrganizationsFromUser(user);

          case 8:
            organizations = _context6.sent;
            organizationToUse = organizations[0];
            space = new Space({
              name: spaceName,
              defaultLocale: defaultLocale,
              users: [user._id],
              organization: organizationToUse._id
            });


            organizationToUse.spaces.push(space._id);

            _context6.next = 14;
            return space.save();

          case 14:
            _context6.next = 16;
            return organizationToUse.save();

          case 16:

            res.json({
              status: 'SUCCESS',
              detail: 'Create space successfully',
              space: space,
              user: user,
              organization: organizationToUse
            });

          case 17:
          case 'end':
            return _context6.stop();
        }
      }
    }, _callee6, undefined);
  }));

  return function (_x11, _x12) {
    return _ref6.apply(this, arguments);
  };
}();

exports.deleteSpace = function (req, res, next) {
  var spaceId = req.params.space_id;
  Space.findOne({ _id: spaceId }, function (err, space) {
    if (err) next(err);

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